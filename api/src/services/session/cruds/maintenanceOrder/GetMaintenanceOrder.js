const { get } = require('lodash');

const MaintenanceOrderDao = require('../../../dao/cruds/MaintenanceOrderDao');

module.exports = class GetMaintenanceOrder {
  constructor() {
    this._queryResult = '';
  }

  getParameters(req) {
    return {
      order: get(req.headers, 'order', ''),
      mysql: get(req, 'mysql'),
    };
  }

  checkParameters({ mysql } = {}) {
    return {
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
    };
  }

  async run(req) {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      const orderResponse = await this.getMaintenanceOrder(parameters);
      
      return orderResponse;
    } catch (err) {
      console.log('err GetMaintenanceOrder :>> ', err);

      throw err;
    }
  }

  async getMaintenanceOrder(parameters) {
    if (parameters.order)
      return new MaintenanceOrderDao(parameters).getDetailOrders();
    
    return new MaintenanceOrderDao(parameters).getSummaryOrders();
  }
};
