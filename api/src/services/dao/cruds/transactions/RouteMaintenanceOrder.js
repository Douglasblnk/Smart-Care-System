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

      await this.insertRouteOrder();

      await this._mysql.commit();

      return { status: 200, msg: 'OK' };
    } catch (err) {
      console.log('err registerOrder => :>> ', err);

      await this._mysql.rollback();
      throw err;
    }
  }
};
