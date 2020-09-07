const OrderTypeDao = require('../../../dao/cruds/OrderTypeDao');

const { get } = require('lodash');

module.exports = class GetOrderType {
  constructor() {
    this._queryResult;
  }
  
  getParameters(req) {
    return {
      mysql: get(req, 'mysql'),
    };
  }

  checkParameters({ mysql }) {
    return {
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
    };
  }

  async run(req) {
    try {
      const parameters = this.getParameters(req);
  
      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      await this.getOrderType(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetOrderType :>> ', err);

      throw err;
    }
  }

  async getOrderType(parameters) {
    this._queryResult = await new OrderTypeDao(parameters).getOrderType();
  }
};
