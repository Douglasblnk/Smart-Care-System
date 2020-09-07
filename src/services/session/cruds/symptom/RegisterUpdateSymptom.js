const SymptomDao = require('../../../dao/cruds/SymptomDao');

const { ADMINISTRADOR_ID } = require('../../../../shared/constants/accessLevel');
const { get } = require('lodash');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

module.exports = class RegisterUpdateSymptom {
  constructor() {
    this._queryReturn;
  }

  getParameters(req) {
    return {
      symptomDescription: get(req.body, 'descricaoSintomas', ''),
      updateId: get(req.params, 'id', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({
    symptomDescription,
    updateId,
    mysql,
    authData,
  } = {}, type = '') {
    return {
      ...(!symptomDescription ? { symptomDescription: 'Descrição do sintoma não informado' } : ''),
      ...(type === 'update' && !updateId ? { updateId: 'Id do sintoma a ser alterado não informado' } : ''),
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

      await this.registerUpdateSymptom(parameters, type);
      
      if (!this._queryReturn.affectedRows)
        throw type ? 'Nenhum registro foi alterado' : 'Nenhum registro foi inserido';

      return this._queryReturn;
    } catch (err) {
      console.log('err RegisterUpdateSymptom :>> ', err);

      throw err;
    }
  }
  
  async registerUpdateSymptom(parameters, type = '') {
    if (type === 'update')
      this._queryReturn = await new SymptomDao(parameters).updateSymptom();

    else this._queryReturn = await new SymptomDao(parameters).registerSymptom();
  }

  async validateGroups({ authData }) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
