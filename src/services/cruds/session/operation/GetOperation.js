const OperationDao = require('../../cruds/dao/OperationDao');

const { get } = require('lodash');

module.exports = class GetOperation {
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

      await this.getOperations(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetOperations :>> ', err);

      throw err;
    }
  }

  async getOperations(parameters) {
    this._queryResult = await new OperationDao(parameters).getOperations();
  }
};
