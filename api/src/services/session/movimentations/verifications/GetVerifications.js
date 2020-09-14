const VerificationDao = require('../../../dao/movimentations/VerificationDao');

const { get } = require('lodash');

module.exports = class GetVerifications {
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

      await this.getVerifications(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetVerifications :>> ', err);

      throw err;
    }
  }

  async getVerifications(parameters) {
    this._queryResult = await new VerificationDao(parameters).getVerifications();
  }
};
