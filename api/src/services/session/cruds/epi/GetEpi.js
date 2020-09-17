const EpiDao = require('../../../dao/cruds/EpiDao');

const { get } = require('lodash');

module.exports = class GetEpi {
  constructor() {
    this._queryReturn = '';
  }

  getParameters(req) {
    return {
      orderId: get(req.headers, 'orderId'),
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

      await this.getEpis(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetEpi :>> ', err);

      throw err;
    }
  }

  async getEpis(parameters) {
    if (parameters.orderId)
      this._queryResult = await new EpiDao(parameters).getOrderEpis();
    else this._queryResult = await new EpiDao(parameters).getEpis();
  }
};
