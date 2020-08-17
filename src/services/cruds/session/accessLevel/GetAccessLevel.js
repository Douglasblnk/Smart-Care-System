const AccessLevelDao = require('../../dao/crudModule/AccessLevelDao');

const { get } = require('lodash');

module.exports = class GetAccessLevel {
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

      await this.getAccessLevel(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetAccessLevel :>> ', err);

      throw err;
    }
  }

  async getAccessLevel(parameters) {
    this._queryResult = await new AccessLevelDao(parameters).getAccessLevel();
  }
};
