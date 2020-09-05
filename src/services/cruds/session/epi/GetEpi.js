const EpiDao = require('../../dao/crudModule/EpiDao');

const { get } = require('lodash');

module.exports = class GetEpi {
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

      await this.getEpis(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetEpi :>> ', err);

      throw err;
    }
  }

  async getEpis(parameters) {
    this._queryResult = await new EpiDao(parameters).getEpis();
  }
};
