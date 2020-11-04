const GenericDao = require('../../GenericDao');

const {
  TABLE_ORDEM_SERVICO,
  TABLE_EQUIPAMENTOS,
  TABLE_ORDEM_SERVICO_HAS_EPI,
  TABLE_LOCAIS,
  TABLE_OPERACOES,
  TABLE_EQUIPAMENTO_OPERACAO,
} = require('../../../../shared/constants/database');

module.exports = class CorrectiveMaintenanceOrder extends GenericDao {
  constructor({
    title,
    summary,
    description,
    typeMaintenance,
    stats,
    requireStop,
    requester,
    report,
    priority,
    plannedStart,
    plannedEnd,
    beginData,
    epis,
    equipmentsWithOperations,
    mysql,
  } = {}) {
    super();

    this._title = title;
    this._summary = summary;
    this._description = description;
    this._typeMaintenance = typeMaintenance;
    this._stats = stats;
    this._requireStop = requireStop;
    this._requester = requester;
    this._report = report;
    this._priority = priority;
    this._plannedStart = plannedStart;
    this._plannedEnd = plannedEnd;
    this._equipmentsWithOperations = equipmentsWithOperations;
    this._epis = epis;
    this._beginData = beginData;
    this._mysql = mysql;

    /* Variáveis de controle */
    this._insertedOrderId = '';
    this._equipmentSectorOperationsIds = [];
  }

  async registerOrder() {
    try {
      await this._mysql.beginTransaction();

      await this.insertRouteOrder();
      await this.insertOrderHasEpis();
      await this.equipmentSectorOperationQueries();
      await this.insertEquipmentOperations();

      await this._mysql.commit();

      return { status: 200, msg: 'OK' };
    } catch (err) {
      console.log('err registerOrder => :>> ', err);

      await this._mysql.rollback();
      throw err;
    }
  }

  async insertRouteOrder() {
    const values = {
      titulo: this._title,
      resumo: this._summary,
      descricao: this._description,
      inicioPlanejado: this._plannedStart,
      fimPlanejado: this._plannedEnd,
      requerParada: this._requireStop,
      dataEmissao: this._beginData,
      tipoManutencao_idtipoManutencao: this._typeMaintenance,
      Prioridade_idPrioridade: this._priority,
      Status_idStatus: this._stats,
      reporte: this._report,
      solicitante: this._requester,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      INSERT INTO ${TABLE_ORDEM_SERVICO} SET ?;
    `, [values]);

    const { insertId } = this.parseInsertResponse(rows);
    this._insertedOrderId = insertId;
  }

  async insertOrderHasEpis() {
    const promises = this._epis.map(async epi => this._mysql.query(/* SQL */`
      INSERT INTO ${TABLE_ORDEM_SERVICO_HAS_EPI} SET ?;
    `, [{ ...epi, ordemServico_idOrdemServico: this._insertedOrderId }]));

    await Promise.all(promises);
  }

  async equipmentSectorOperationQueries() {
    const promises = this._equipmentsWithOperations.map(async equipment => ([
      await this.insertEquipment(equipment),
      await this.insertSector(equipment),
      await this.insertOperations(equipment),
    ]));

    const response = await Promise.all(promises);
    
    this.addEquipmentSectorOperationIds(response);
  }

  async insertEquipmentOperations() {
    for (const operation of this._equipmentSectorOperationsIds) await this.insertMultipleOperations(operation);
  }

  async insertMultipleOperations({ Equipamentos, Locais, Operacao }) {
    const values = {
      Equipamento_FK: Equipamentos,
      Locais_FK: Locais,
    };

    const promises = Operacao.map(op => this._mysql.query(/* SQL */`
      INSERT INTO ${TABLE_EQUIPAMENTO_OPERACAO} SET ?;
    `, [{ ...values, Operacao_FK: op }]));

    await Promise.all(promises);
  }

  async insertEquipment({ Equipamento }) {
    const values = {
      Equipamento,
      Ordem_servico: this._insertedOrderId,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      INSERT INTO ${TABLE_EQUIPAMENTOS} SET ?;
    `, [values]);

    const { insertId } = this.parseInsertResponse(rows);
    return insertId;
  }

  async insertSector({ Local }) {
    const values = {
      Local,
      Ordem_servico: this._insertedOrderId,
    };

    const [rows] = await this._mysql.query(/* SQL */ `
      INSERT INTO ${TABLE_LOCAIS} SET ?;
    `, [values]);

    const { insertId } = this.parseInsertResponse(rows);
    return insertId;
  }

  async insertOperations({ operationList }) {
    const promises = operationList.map(operation => this._mysql.query(/* SQL */ `
      INSERT INTO ${TABLE_OPERACOES} SET ?;
    `, [operation]));

    const response = await Promise.all(promises);

    return this.parseMultipleInsertResponse(response).map(i => i.insertId);
  }

  addEquipmentSectorOperationIds(equipmentSectorOperationIds) {
    equipmentSectorOperationIds.forEach(insertedIds => {
      const [equipmentId, sectorId, operationsId] = insertedIds;

      this._equipmentSectorOperationsIds.push({
        Equipamentos: equipmentId,
        Locais: sectorId,
        Operacao: operationsId,
      });
    });
  }
};
