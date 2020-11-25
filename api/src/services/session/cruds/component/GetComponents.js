const ComponentsDao = require('../../../dao/cruds/ComponentsDao');

const { get } = require('lodash');

module.exports = class GetComponents {
  constructor() {
    this._queryResult = '';
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

      await this.getComponent(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetComponents :>> ', err);

      throw err;
    }
  }

  async getComponent(parameters) {
    this._queryResult = await new ComponentsDao(parameters).getComponents();
  }
};
