const PriorityDao = require('../../../dao/cruds/PriorityDao');

const { get } = require('lodash');

module.exports = class GetPriority {
  constructor() {
    this._queryReturn = '';
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

      await this.getPriority(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetPriority :>> ', err);

      throw err;
    }
  }

  async getPriority(parameters) {
    this._queryResult = await new PriorityDao(parameters).getPriority();
  }
};
