const MaintenanceOrderDao = require('../../dao/MaintenanceOrderDao');

const { get } = require('lodash');

module.exports = class GetMaintenanceOrder {
  constructor() {
    this._queryResult;
  }
  
  getParameters(req) {
    return {
      type: get(req.headers, 'type', ''),
      order: get(req.headers, 'order', ''),
      mysql: get(req, 'mysql'),
    };
  }

  checkParameters({ type, order, mysql } = {}) {
    return {
      ...(type !== 'summary' && !order ? { order: 'Número da Ordem não informado' } : ''),
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
    };
  }

  async run(req) {
    try {
      const parameters = this.getParameters(req);
  
      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      await this.getMaintenanceOrder(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetMaintenanceOrder :>> ', err);

      throw err;
    }
  }

  async getMaintenanceOrder(parameters) {
    if (parameters.type === 'summary')
      this._queryResult = await new MaintenanceOrderDao(parameters).getSummaryOrders();

    else this._queryResult = await new MaintenanceOrderDao(parameters).getDetailOrders();
  }
};
