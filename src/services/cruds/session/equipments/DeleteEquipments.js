const EquipmentsDao = require('../../dao/crudModule/EquipmentsDao');

const { ADMINISTRADOR_ID } = require('../../../../shared/constants/accessLevel');
const { get } = require('lodash');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

module.exports = class DeleteEquipments {
  constructor() {
    this._queryReturn;
  }

  getParameters(req) {
    return {
      updateId: get(req.params, 'id', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({ updateId, mysql, authData }) {
    return {
      ...(!updateId ? { numeroCracha: 'ID do equipamento não infomado' } : ''),
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
      await this.deleteEquipment(parameters);
      
      if (!this._queryReturn.affectedRows)
        throw 'Não foi possível deletar o equipamento';
      
      return this._queryReturn;
    } catch (err) {
      console.log('err DeleteEquipment :>> ', err);

      throw err;
    }
  }
  
  async deleteEquipment(user) {
    this._queryReturn = await new EquipmentsDao(user).deleteEquipment();
  }

  async validateGroups({ authData }) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
