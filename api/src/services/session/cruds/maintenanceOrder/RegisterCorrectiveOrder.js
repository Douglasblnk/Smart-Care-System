const CorrectiveOrderDao = require('../../../dao/cruds/transactions/CorrectiveMaintenanceOrder');

const { MANUTENTOR_ID } = require('../../../../shared/constants/accessLevel');
const { get } = require('lodash');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

module.exports = class RegisterCorrectiveMaintenanceOrder {
  constructor() {
    this._queryResult = {};
  }

  getParameters(req) {
    return {
      title: get(req.body, 'title', ''),
      typeMaintenance: get(req.body, 'typeMaintenance', ''),
      summary: get(req.body, 'summary', ''),
      stats: get(req.body, 'stats', ''),
      sector: get(req.body, 'sector', ''),
      requireStop: get(req.body, 'requireStop', ''),
      requester: get(req.body, 'requester', ''),
      report: get(req.body, 'report', ''),
      priority: get(req.body, 'priority', ''),
      plannedTime: get(req.body, 'plannedTime', ''),
      plannedStart: get(req.body, 'plannedStart', ''),
      plannedEnd: get(req.body, 'plannedEnd', ''),
      operations: get(req.body, 'operations', ''),
      equipment: get(req.body, 'equipment', ''),
      epis: get(req.body, 'epis', ''),
      description: get(req.body, 'description', ''),
      beginData: get(req.body, 'beginData', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({
    title,
    typeMaintenance,
    summary,
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
    description,
    beginData,
    mysql,
    authData,
  } = {}) {
    return {
      ...(!title ? { title: 'Titulo não informado' } : ''),
      ...(!summary ? { summary: 'Resumo não informado' } : ''),
      ...(!description ? { description: 'Descrição não informada' } : ''),
      ...(!typeMaintenance ? { typeMaintenance: 'Tipo de ordem não informado' } : ''),
      ...(!stats ? { stats: 'Status não informado' } : ''),
      ...(!sector ? { sector: 'Local de instalação não informado' } : ''),
      ...(!requireStop ? { requireStop: 'Requer parada não informada' } : ''),
      ...(!requester ? { requester: 'Solicitante não informado' } : ''),
      ...(!report ? { report: 'Reporte não informado' } : ''),
      ...(!priority ? { priority: 'Prioridade não informada' } : ''),
      ...(!plannedStart ? { plannedStart: 'Início planejado não informado' } : ''),
      ...(!plannedEnd ? { plannedEnd: 'Fim planejado não informado' } : ''),
      ...(!operations ? { operations: 'Operação não informada' } : ''),
      ...(!equipment ? { equipment: 'Equipamento não informado' } : ''),
      ...(!epis ? { epis: 'EPI não informada' } : ''),
      ...(!beginData ? { beginData: 'Emissão não informada' } : ''),
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
      ...(!authData ? { authData: 'Dados de autenticação não encontrados' } : ''),
    };
  }

  async run(req) {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;
      
      await this.validateGroups(parameters);

      await this.registerCorrectiveMaintenanceOrder(parameters);
      
      if (this._queryResult.status !== 200 && this._queryResult.msg !== 'OK')
        throw 'Nenhum registro foi inserido';

      return this._queryResult;
    } catch (err) {
      console.log('err RegisterCorrectiveMaintenanceOrder :>> ', err);

      throw err;
    }
  }
  
  async registerCorrectiveMaintenanceOrder(parameters) {
    this._queryResult = await new CorrectiveOrderDao(parameters).registerOrder();
  }

  async validateGroups({ authData } = {}) {
    if (authData.nivel_acesso === MANUTENTOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
