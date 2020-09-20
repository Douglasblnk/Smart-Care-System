const VerificationDao = require('../../../dao/movimentations/VerificationDao');

const { ADMINISTRADOR_ID } = require('../../../../shared/constants/accessLevel');
const { get } = require('lodash');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

module.exports = class RegisterVerification {
  constructor() {
    this._queryReturn = '';
  }

  getParameters(req) {
    return {
      solutionDescription: get(req.body, 'solutionDescription', ''),
      resolved: get(req.body, 'resolved', ''),
      dateVerification: get(req.body, 'dateVerification', ''),
      order: get(req.body, 'order', ''),
      typeVerification: get(req.body, 'typeVerification', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({
    solutionDescription,
    dateVerification,
    order,
    typeVerification,
    mysql,
    authData,
  }) {
    return {
      ...(!solutionDescription ? { solutionDescription: 'Descrição da solução não informada' } : ''),
      ...(!dateVerification ? { dateVerification: 'Data da verificação não informada' } : ''),
      ...(!order ? { order: 'Ordem não informada' } : ''),
      ...(!typeVerification ? { typeVerification: 'Tipo de verificação não informada' } : ''),
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

      await this.registerVerification(parameters);

      if (!this._queryReturn.affectedRows)
        throw 'Nenhum registro foi inserido';

      return this._queryReturn;
    } catch (err) {
      console.log('err RegisterVerification :>> ', err);

      throw err;
    }
  }

  async registerVerification(parameters) {
    // todo
    // this._queryReturn = await new VerificationDao(parameters);
  }

  async validateGroups({ authData }) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
