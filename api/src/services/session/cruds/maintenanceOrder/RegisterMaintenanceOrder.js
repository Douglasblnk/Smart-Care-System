const { get } = require('lodash');
const CorrectiveOrderDao = require('../../../dao/cruds/transactions/CorrectiveMaintenanceOrder');
const PreventiveOrderDao = require('../../../dao/cruds/transactions/PreventiveMaintenanceOrder');
const RouteOrderDao = require('../../../dao/cruds/transactions/RouteMaintenanceOrder');
const ListOrderDao = require('../../../dao/cruds/transactions/ListMaintenanceOrder');
const { MANUTENTOR_ID } = require('../../../../shared/constants/accessLevel');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

const {
  CORRECTIVE,
  PREVENTIVE,
  ROUTE,
  LIST,
} = require('../../../../shared/constants/orderType');

module.exports = class RegisterMaintenanceOrder {
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
      equipmentsWithOperations: get(req.body, 'equipments_sectors_operations', ''),
      equipmentsSectors: get(req.body, 'equipments_sectors', ''),
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
    description,
    beginData,
    equipmentsSectors,
    equipmentsWithOperations,
    mysql,
    authData,
  } = {}) {
    return {
      ...(!title ? { title: 'Titulo não informado' } : ''),
      ...(!summary ? { summary: 'Resumo não informado' } : ''),
      ...(!typeMaintenance ? { typeMaintenance: 'Tipo de ordem não informado' } : ''),
      ...((typeMaintenance === CORRECTIVE && !description) ? { description: 'Descrição não informada' } : ''),
      ...(!stats ? { stats: 'Status não informado' } : ''),
      ...(!requireStop ? { requireStop: 'Requer parada não informada' } : ''),
      ...(!requester ? { requester: 'Solicitante não informado' } : ''),
      ...(!report ? { report: 'Reporte não informado' } : ''),
      ...(!priority ? { priority: 'Prioridade não informada' } : ''),
      ...(!plannedStart ? { plannedStart: 'Início planejado não informado' } : ''),
      ...(!plannedEnd ? { plannedEnd: 'Fim planejado não informado' } : ''),
      ...(!beginData ? { beginData: 'Emissão não informada' } : ''),
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
      ...(!authData ? { authData: 'Dados de autenticação não encontrados' } : ''),
      ...(
        ((typeMaintenance === PREVENTIVE || typeMaintenance === LIST) && !operations)
          ? { operations: 'Operação não informada' }
          : ''
      ),
      ...(
        (typeMaintenance !== ROUTE && typeMaintenance !== LIST && !sector)
          ? { sector: 'Local de instalação não informado' }
          : ''
      ),
      ...(
        (typeMaintenance !== ROUTE && typeMaintenance !== LIST && !equipment)
          ? { equipment: 'Equipamento não informado' }
          : ''
      ),
      ...(
        (typeMaintenance === ROUTE && !equipmentsWithOperations)
          ? { equipmentOperations: 'Equipamentos e operações não informadas' }
          : ''
      ),
      ...(
        (typeMaintenance === LIST && !equipmentsSectors)
          ? { equipmentsSectors: 'Equipamento e setor não informado' }
          : ''
      ),
    };
  }

  async run(req) {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;
      
      await this.validateGroups(parameters);

      const response = await this.registerMaintenanceOrder(parameters);
      
      if (response.status !== 200 && response.msg !== 'OK')
        throw 'Nenhum registro foi inserido';

      return response;
    } catch (err) {
      console.log('err RegisterMaintenanceOrder :>> ', err);

      throw err;
    }
  }
  
  async registerMaintenanceOrder(parameters) {
    if (parameters.typeMaintenance === CORRECTIVE)
      return new CorrectiveOrderDao(parameters).registerOrder();
      
    if (parameters.typeMaintenance === PREVENTIVE)
      return new PreventiveOrderDao(parameters).registerOrder();

    if (parameters.typeMaintenance === ROUTE)
      return new RouteOrderDao(parameters).registerOrder();

    if (parameters.typeMaintenance === LIST)
      return new ListOrderDao(parameters).registerOrder();
  }

  async validateGroups({ authData } = {}) {
    if (authData.nivel_acesso === MANUTENTOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
