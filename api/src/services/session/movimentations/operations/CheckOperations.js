// const VerificationDao = require('../../../dao/movimentations/VerificationDao');

const { MANUTENTOR_ID } = require('../../../../shared/constants/accessLevel');
const { get } = require('lodash');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

module.exports = class CheckOperations {
  constructor() {
    this._queryResult = '';
  }

  getParameters(req) {
    return {
      operation: get(req.body, 'operation', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({
    operation,
    mysql,
    authData,
  }) {
    return {
      ...(!operation ? { operation: 'Operação não informada' } : ''),
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
      await this.validateMaintainerPermission(parameters);

      // await this.checkOperation(parameters);

      // if (!this._queryResult.affectedRows)
      //   throw 'Nenhum registro foi inserido';

      // return this._queryResult;
    } catch (err) {
      console.log('err CheckOperations :>> ', err);

      throw err;
    }
  }

  async checkOperation({ operation }) {
    // todo
  }

  async validateMaintainerPermission({ authData }) {
    // todo
  }

  async validateGroups({ authData }) {
    if (authData.nivel_acesso !== MANUTENTOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
