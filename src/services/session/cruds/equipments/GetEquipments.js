const EquipmentsDao = require('../../../dao/cruds/EquipmentsDao');

const { get } = require('lodash');

module.exports = class GetEquipments {
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

      await this.getEquipments(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetEquipments :>> ', err);

      throw err;
    }
  }

  async getEquipments(parameters) {
    this._queryResult = await new EquipmentsDao(parameters).getEquipments();
  }
};
