const EpiDao = require('../../../dao/cruds/EpiDao');

const { ADMINISTRADOR_ID } = require('../../../../shared/constants/accessLevel');
const { get } = require('lodash');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

module.exports = class RegisterUpdateEpi {
  constructor() {
    this._queryReturn = '';
  }

  getParameters(req) {
    return {
      epiDescription: get(req.body, 'descricaoEpi', ''),
      updateId: get(req.params, 'id', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({
    epiDescription,
    updateId,
    mysql,
    authData,
  }, type = '') {
    return {
      ...(!epiDescription ? { epiDescription: 'Descrição da epi não informada' } : ''),
      ...(type === 'update' && !updateId ? { updateId: 'Id do EPI a ser alterado não informada' } : ''),
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

      await this.registerUpdateEpi(parameters, type);

      if (!this._queryReturn.affectedRows)
        throw type ? 'Nenhum registro foi alterado' : 'Nenhum registro foi inserido';

      return this._queryReturn;
    } catch (err) {
      console.log('err RegisterUpdateEpi :>> ', err);

      throw err;
    }
  }

  async registerUpdateEpi(parameters, type = '') {
    if (type === 'update')
      this._queryReturn = await new EpiDao(parameters).updateEpi();

    else this._queryReturn = await new EpiDao(parameters).registerEpi();
  }

  async validateGroups({ authData }) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
