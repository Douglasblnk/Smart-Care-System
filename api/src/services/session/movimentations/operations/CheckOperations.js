const { get } = require('lodash');

const UserDao = require('../../../dao/cruds/UserDao');
const CheckOperationDao = require('../../../dao/movimentations/CheckOperation');

const { MANUTENTOR_ID } = require('../../../../shared/constants/accessLevel');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

module.exports = class CheckOperations {
  getParameters(req) {
    return {
      orderId: get(req.body, 'order'),
      equipmentId: get(req.body, 'equipment'),
      operation: get(req.body, 'operation', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({
    orderId,
    operation,
    equipmentId,
    mysql,
    authData,
  }) {
    return {
      ...(!orderId ? { orderId: 'Id da ordem não informada' } : ''),
      ...(!equipmentId ? { equipmentId: 'Id do equipmento não informado' } : ''),
      ...(!operation ? { operation: 'Operação não informada' } : ''),
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
      await this.validateMaintainerPermission(parameters);

      const checked = await this.getOperationCheckedValue(parameters);

      const response = await this.checkOperation({ ...parameters, checked });

      if (!response.affectedRows)
        throw 'Nenhum registro foi alterado';

      return response;
    } catch (err) {
      console.log('err CheckOperations :>> ', err);

      throw err;
    }
  }

  async checkOperation(parameters) {
    return new CheckOperationDao(parameters).checkOperation();
  }

  async getOperationCheckedValue(parameters) {
    const operation = await new CheckOperationDao(parameters).getOperation();

    if (!operation.execucao) return 1;
    return 0;
  }

  async validateMaintainerPermission(parameters) {
    try {
      const usersInOrder = await this.getUserInOrderQuery(parameters);
      
      const masterMaintainer = this.getMasterMaintainer(usersInOrder);

      if (parameters.authData.numeroCracha !== masterMaintainer.numeroCracha)
        throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
    } catch (err) {
      throw err;
    }
  }

  getMasterMaintainer(usersInOrder) {
    if (Array.isArray(usersInOrder) && usersInOrder.lenght !== undefined)
      return usersInOrder.find(i => i.is_master);
    
    return usersInOrder;
  }

  async getUserInOrderQuery(parameters) {
    return new UserDao(parameters).getMaintainersInOrder();
  }

  async validateGroups({ authData }) {
    if (authData.nivel_acesso !== MANUTENTOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
