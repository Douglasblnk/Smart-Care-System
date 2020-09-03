const CauseDao = require('../../dao/crudModule/CauseDao');

const { ADMINISTRADOR_ID } = require('../../../../shared/constants/accessLevel');
const { get } = require('lodash');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

module.exports = class RegisterUpdateCause {
  constructor() {
    this._queryReturn;
  }

  getParameters(req) {
    return {
      causeDescription: get(req.body, 'descricaoCausa', ''),
      updateId: get(req.params, 'id', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({
    causeDescription,
    updateId,
    mysql,
    authData,
  }, type = '') {
    return {
      ...(!causeDescription ? { causeDescription: 'Conexão não estabelecida' } : ''),
      ...(type === 'update' && !updateId ? { updateId: 'Id da causa a ser alterado não informada' } : ''),
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

      await this.registerUpdateCause(parameters, type);
      
      if (!this._queryReturn.affectedRows)
        throw type ? 'Nenhum registro foi alterado' : 'Nenhum registro foi inserido';

      return this._queryReturn;
    } catch (err) {
      console.log('err RegisterUpdateCause :>> ', err);

      throw err;
    }
  }
  
  async registerUpdateCause(parameters, type = '') {
    if (type === 'update')
      this._queryReturn = await new CauseDao(parameters).updateCause();

    else this._queryReturn = await new CauseDao(parameters).registerCause();
  }

  async validateGroups({ authData }) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
