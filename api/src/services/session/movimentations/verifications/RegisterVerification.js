const { get } = require('lodash');
const VerificationDao = require('../../../dao/movimentations/VerificationDao');
const VerificationValidate = require('../../../dao/movimentations/validate/VerificationValidate');

const { ADMINISTRADOR_ID } = require('../../../../shared/constants/accessLevel');
const { MANUTENTOR_ID } = require('../../../../shared/constants/accessLevel');
const { STATUS_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');
const { MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

module.exports = class RegisterVerification {
  constructor() {
    this._queryResult = '';
  }

  getParameters(req) {
    return {
      solutionDescription: get(req.body, 'solutionDescription', ''),
      resolved: get(req.body, 'resolved', ''),
      dateVerification: get(req.body, 'dateVerification', ''),
      order: get(req.body, 'order', ''),
      typeVerification: get(req.body, 'typeVerification', ''),
      cracha: get(req.body, 'cracha', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({
    solutionDescription,
    dateVerification,
    order,
    typeVerification,
    cracha,
    mysql,
    authData,
  }) {
    return {
      ...(!solutionDescription ? { solutionDescription: 'Descrição da solução não informada' } : ''),
      ...(!dateVerification ? { dateVerification: 'Data da verificação não informada' } : ''),
      ...(!order ? { order: 'Ordem não informada' } : ''),
      ...(!typeVerification ? { typeVerification: 'Tipo de verificação não informada' } : ''),
      ...(!cracha ? { cracha: 'Cracha não informado' } : ''),
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
      ...(!authData ? { authData: 'Dados de autenticação não encontrados' } : ''),
    };
  }

  async run(req) {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;
      
      if (parameters.authData.nivel_acesso === MANUTENTOR_ID) {
        const maintainerMaster = await this.getMaintainerMaster(parameters);
        console.log('maintainerMaster.length: ', maintainerMaster.length);
        if (maintainerMaster.length < 1)
          throw 'Este manutentor não é responsável pela ordem!';
      }

      await this.registerVerification(parameters);

      if (!this._queryResult.affectedRows)
        throw 'Nenhum registro foi inserido';

      return this._queryResult;
    } catch (err) {
      console.log('err RegisterVerification :>> ', err);

      throw err;
    }
  }

  async registerVerification(parameters) {
    // todo
    this._queryResult = await new VerificationDao(parameters).registerVerification();
  }

  async validateGroups(parameters) {
    // if (authData.nivel_acesso !== ADMINISTRADOR_ID)
    //   throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }

  async getMaintainerMaster(parameters) {
    try {
      console.log('VerificationValidate: ', new VerificationValidate(parameters).validateVerification());
      return new VerificationValidate(parameters).validateVerification();
    } catch (err) {
      throw err;
    }
  }
};
