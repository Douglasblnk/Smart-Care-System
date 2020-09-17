const InstallationLocationDao = require('../../../dao/cruds/InstallationLocationDao');

const { get } = require('lodash');

module.exports = class GetInstallationLocation {
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

      await this.getEquipments(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetInstallationLocation :>> ', err);

      throw err;
    }
  }

  async getEquipments(parameters) {
    this._queryResult = await new InstallationLocationDao(parameters).getSector();
  }
};
