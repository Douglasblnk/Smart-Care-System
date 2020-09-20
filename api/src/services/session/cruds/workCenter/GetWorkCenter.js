const WorkCenterDao = require('../../../dao/cruds/WorkCenterDao');

const { get } = require('lodash');

module.exports = class GetWorkCenter {
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

      await this.getWorkCenter(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetWorkCenter :>> ', err);

      throw err;
    }
  }

  async getWorkCenter(parameters) {
    this._queryResult = await new WorkCenterDao(parameters).getWorkCenter();
  }
};
