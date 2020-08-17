const SymptomDao = require('../../dao/crudModule/SymptomDao');

const { get } = require('lodash');

module.exports = class GetSymptom {
  constructor() {
    this._queryResult;
  }
  
  getParameters(req) {
    return {
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

      await this.getSymptom(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetSymptom :>> ', err);

      throw err;
    }
  }

  async getSymptom(parameters) {
    this._queryResult = await new SymptomDao(parameters).getSymptom();
  }
};
