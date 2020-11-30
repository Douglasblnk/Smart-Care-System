const { get } = require('lodash');
const VerificationDao = require('../../../dao/movimentations/VerificationDao');
const VerificationValidate = require('../../../dao/movimentations/validations/VerificationValidate');

const { MANUTENTOR_ID, SOLICITANTE_ID, ADMINISTRADOR_ID } = require('../../../../shared/constants/accessLevel');

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
      
      await this.validateExistVerification(parameters);
      await this.validateCheckSequence(parameters);

      if (parameters.authData.nivel_acesso === MANUTENTOR_ID) {
        const maintainerMaster = await this.getMaintainerMaster(parameters);

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

  async validateExistVerification(parameters) {
    try {
      const verificationsData = await this.getVerificationType(parameters);

      if (verificationsData.length > 0 || verificationsData.length === undefined)
        throw 'Esta verificação já foi realizada!';
    } catch (err) {
      throw err;
    }
  }

  async validateCheckSequence(parameters) {
    try {
      if (parameters.authData.nivel_acesso === SOLICITANTE_ID) {
        const verificationsData = await this.getCheckSequence(parameters, MANUTENTOR_ID);

        if (verificationsData.length < 1 && verificationsData.length !== undefined)
          throw 'A verificação do Manutentor deve ser realizada anteriormente!';
      } else if (parameters.authData.nivel_acesso === ADMINISTRADOR_ID) {
        const verificationsData = await this.getCheckSequence(parameters, SOLICITANTE_ID);

        if (verificationsData.length < 1 && verificationsData.length !== undefined)
          throw 'A verificação do Solicitante deve ser realizada anteriormente!';
      }
    } catch (err) {
      throw err;
    }
  }

  async getMaintainerMaster(parameters) {
    try {
      return new VerificationValidate(parameters).validateVerification();
    } catch (err) {
      throw err;
    }
  }

  async getVerificationType(parameters) {
    return new VerificationValidate(parameters).validateRegisterExist();
  }
  
  async getCheckSequence(parameters, typeVerification) {
    return new VerificationValidate(parameters).validateCheckPreviousSequence(typeVerification);
  }
};
