const GenericDao = require('../GenericDao');

const {
  TABLE_ORDEM_SERVICO_HAS_USUARIO,
  TABLE_ORDEM_SERVICO,
  TABLE_EQUIPAMENTOS,
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

    // Variáveis de controle
    this._insertedOrderId = {};
  }

  async registerOrder() {
    try {
      await this._mysql.beginTransaction();

      await this.correctiveOrder();
      await this.insertEquipments();
      await this._mysql.commit();

      return [];
    } catch (err) {
      console.log('err registerOrder => :>> ', err);

      await this._mysql.rollback();
      throw err;
    }
  }

  async correctiveOrder() {
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

  async insertEquipments() {
    const values = {
      Equipamento: this._equipment,
    };

    const [rows] = await this._mysql.query(/* SQL */`
    INSERT INTO ${TABLE_EQUIPAMENTOS} SET ?;
    `, [values]);

    const { insertId } = this.parseInsertResponse(rows);
    this._insertedOrderId = insertId;
  }
};
