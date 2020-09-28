const { get } = require('lodash');

const UsersInOrder = require('../../../dao/movimentations/UsersInOrderDao');

module.exports = class GetUsersInOrder {
  constructor() {
    this._queryResult = '';
  }

  getParameters(req) {
    return {
      orderId: get(req.headers, 'order_id'),
      mysql: get(req, 'mysql'),
    };
  }

  checkParameters({ orderId, mysql }) {
    return {
      ...(!orderId ? { orderId: 'Id da ordem não informada!' } : ''),
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
    };
  }

  async run(req) {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      await this.getUsersInOrder(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetUsersInOrder :>> ', err);

      throw err;
    }
  }

  async getUsersInOrder(parameters) {
    this._queryResult = await new UsersInOrder(parameters).getUsersInOrder();
  }
};
