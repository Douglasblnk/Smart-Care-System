const InstallationLocationDao = require('../../dao/InstallationLocationDao');

const { ADMINISTRADOR_ID } = require('../../../../shared/constants/accessLevel');
const { get } = require('lodash');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

module.exports = class RegisterUpdateInstallationLocation {
  constructor() {
    this._queryReturn;
  }

  getParameters(req) {
    return {
      sector: get(req.body, 'nome', ''),
      updateId: get(req.params, 'id', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({ sector, updateId, mysql, authData }, type = '') {
    return {
      ...(!sector ? { sector: 'Setor não informado' } : ''),
      ...(type === 'update' && !updateId ? { updateId: 'Id do Setor a ser alterado não informado' } : ''),
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
      ...(!authData ? { authData: 'Dados de autenticação não encontrados' } : ''),
    };
  }

  async run(req, type = '') {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters, type);
      if (Object.values(errors).length > 0) throw errors;
      
      await this.validateGroups(parameters);

      await this.registerUpdateInstallationLocation(parameters, type);
      
      if (!this._queryReturn.affectedRows)
        throw type ? 'Nenhum registro foi alterado' : 'Nenhum registro foi inserido';

      return this._queryReturn;
    } catch (err) {
      console.log('err RegisterUpdateInstallationLocation :>> ', err);

      throw err;
    }
  }
  
  async registerUpdateInstallationLocation(parameters, type = '') {
    if (type === 'update')
      this._queryReturn = await new InstallationLocationDao(parameters).updateSector();

    else this._queryReturn = await new InstallationLocationDao(parameters).registerSector();
  }

  async validateGroups({ authData }) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
