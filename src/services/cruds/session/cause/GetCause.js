const CauseDao = require('../../dao/CauseDao');

const { get } = require('lodash');

module.exports = class GetCause {
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

      await this.getCauses(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetCause :>> ', err);

      throw err;
    }
  }

  async getCauses(parameters) {
    this._queryResult = await new CauseDao(parameters).getCauses();
  }
};
