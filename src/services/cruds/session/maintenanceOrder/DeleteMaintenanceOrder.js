const MaintenanceOrderDao = require('../../dao/orderModule/MaintenanceOrderDao');

const { ADMINISTRADOR_ID } = require('../../../../shared/constants/accessLevel');
const { get } = require('lodash');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

module.exports = class DeleteMaintenanceOrder {
  constructor() {
    this._queryReturn;
  }

  getParameters(req) {
    return {
      order: get(req.params, 'id', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({ order, mysql, authData } = {}) {
    return {
      ...(!order ? { numeroCracha: 'ID da ordem não informada' } : ''),
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
      ...(!authData ? { authData: 'Dados de autenticação não encontrados' } : ''),
    };
  }

  async run(req) {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;
      
      await this.validateGroups(parameters);
      await this.deleteOrder(parameters);

      if (!this._queryReturn.affectedRows)
        throw 'Não foi possível deletar a ordem de manutenção';
      
      return this._queryReturn;
    } catch (err) {
      console.log('err DeleteMaintenanceOrder :>> ', err);

      throw err;
    }
  }
  
  async deleteOrder(parameters) {
    this._queryReturn = await new MaintenanceOrderDao(parameters).deleteOrder();
  }

  async validateGroups({ authData } = {}) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
