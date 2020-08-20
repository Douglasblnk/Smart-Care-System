const GenericDao = require('../GenericDao');

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
    sector,
    requireStop,
    requester,
    report,
    priority,
    plannedStart,
    plannedEnd,
    operations,
    equipment,
    epis,
    beginData,
    mysql,
  } = {}) {
    super();

    this._title = title;
    this._summary = summary;
    this._description = description;
    this._typeMaintenance = typeMaintenance;
    this._stats = stats;
    this._sector = sector;
    this._requireStop = requireStop;
    this._requester = requester;
    this._report = report;
    this._priority = priority;
    this._plannedStart = plannedStart;
    this._plannedEnd = plannedEnd;
    this._operations = operations;
    this._equipment = equipment;
    this._epis = epis;
    this._beginData = beginData;
    this._mysql = mysql;

    /* Variáveis de controle */
    this._insertedOrderId = '';
    this._insertedEquipmentId = '';
    this._insertedSectorId = '';
    this._insertedOperationsId = [];
  }

  async registerOrder() {
    try {
      await this._mysql.beginTransaction();

      await this.insertCorrectiveOrder();
      await this.insertOrderHasEpis();
      await this.insertEquipments();
      await this.insertSectors();
      await this.insertOperations();
      await this.insertEquipmentOperations();

      await this._mysql.commit();

      return { status: 200, msg: 'OK' };
    } catch (err) {
      console.log('err registerOrder => :>> ', err);

      await this._mysql.rollback();
      throw err;
    }
  }

  async insertCorrectiveOrder() {
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
      INSERT INTO ${TABLE_ORDEM_SERVICO} SET ?
    `, [values]);

    const { insertId } = this.parseInsertResponse(rows);
    this._insertedOrderId = insertId;
  }
  
  async insertOrderHasEpis() {
    const promises = this._epis.map(async epi => {
      return await this._mysql.query(/* SQL */`
        INSERT INTO ${TABLE_ORDEM_SERVICO_HAS_EPI} SET ?;
      `, [{ ...epi, ordemServico_idOrdemServico: this._insertedOrderId }]);
    });

    await Promise.all(promises);
  }

  async insertEquipments() {
    const values = {
      Equipamento: this._equipment,
      Ordem_servico: this._insertedOrderId,
    };

    const [row] =await this._mysql.query(/* SQL */`
      INSERT INTO ${TABLE_EQUIPAMENTOS} SET ?;
    `, [values]);

    this._insertedEquipmentId = this.parseInsertResponse(row).insertId;
  }

  async insertSectors() {
    const values = {
      Local: this._sector,
      Ordem_servico: this._insertedOrderId,
    };

    const [row] = await this._mysql.query(/* SQL */`
      INSERT INTO ${TABLE_LOCAIS} SET ?;
    `, [values]);

    this._insertedSectorId = this.parseInsertResponse(row).insertId;
  }

  async insertOperations() {
    const promises = this._operations.map(async operation => {
      return await this._mysql.query(/* SQL */`
        INSERT INTO ${TABLE_OPERACOES} SET ?;
      `, [operation]);
    });

    const rows = await Promise.all(promises);
  
    this._insertedOperationsId = rows.map(([row]) => this.parseInsertResponse(row).insertId);
  }

  async insertEquipmentOperations() {
    const promises = this._insertedOperationsId.map(async operationsId => {
      return await this._mysql.query(/* SQL */`
        INSERT INTO ${TABLE_EQUIPAMENTO_OPERACAO} SET ?;
      `, [
        {
          Equipamento_FK: this._insertedEquipmentId,
          Operacao_FK: operationsId,
          Locais_FK: this._insertedSectorId,
        },
      ]);
    });

    await Promise.all(promises);
  }
};
