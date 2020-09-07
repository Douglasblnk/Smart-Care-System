const statusDao = require('../../dao/StatusDao');

const { get } = require('lodash');

module.exports = class GetStatus {
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

      await this.getStatus(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err getStatus :>> ', err);

      throw err;
    }
  }

  async getStatus(parameters) {
    this._queryResult = await new statusDao(parameters).getStatus();
  }
};
