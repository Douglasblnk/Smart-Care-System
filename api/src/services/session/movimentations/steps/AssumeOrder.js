// import AssumeOrderTransaction from '../../../../shared/dao/AssumeOrderTransaction'
const { get } = require('lodash');
const UserDao = require('../../../dao/cruds/UserDao');
const AssumeOrderDao = require('../../../dao/movimentations/transactions/AssumeOrder');

const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');
const { MANUTENTOR_ID } = require('../../../../shared/constants/accessLevel');

module.exports = class AssumeOrder {
  getParameters(req) {
    return {
      orderId: get(req.body, 'order', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({
    orderId,
    mysql,
    authData,
  }) {
    return {
      ...(!orderId ? { orderId: 'Valor do \'orderId\' não encontrado' } : ''),
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
      ...(!authData ? { authData: 'Dados de autenticação não encontrados' } : ''),
    };
  }

  async run(req) {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters);
      if (Object.keys(errors).length > 0) throw errors;

      await this.validateGroups(parameters);
      await this.validateUsersInOrders(parameters);

      const response = await this.assumeOrder(parameters);

      return response;
    } catch (err) {
      console.log('err AssumeOrder :>> ', err);

      throw err;
    }
  }

  async assumeOrder({ mysql, authData, orderId }) {
    return new AssumeOrderDao({ mysql, orderId, userId: authData.idUsuario }).assumeOrder();
  }

  async validateGroups({ authData }) {
    if (authData.nivel_acesso !== MANUTENTOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }

  async validateUsersInOrders(parameters) {
    try {
      const userInOrder = await this.getUserInOrderQuery(parameters);
            
      if (userInOrder.length === undefined && userInOrder.is_master)
        throw 'Ordem já assumida!';
      
      const isOrderAssumed = userInOrder.some(i => i.is_master);
     
      if (isOrderAssumed) throw String('Ordem já assumida!');
    } catch (err) {
      throw err;
    }
  }

  async getUserInOrderQuery(parameters) {
    return new UserDao(parameters).getMaintainersInOrder();
  }
};
