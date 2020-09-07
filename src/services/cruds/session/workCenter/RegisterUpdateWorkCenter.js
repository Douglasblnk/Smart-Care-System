const WorkCenterDao = require('../../dao/WorkCenterDao');

const { ADMINISTRADOR_ID } = require('../../../shared/constants/accessLevel');
const { get } = require('lodash');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../shared/constants/HTTPResponse');

module.exports = class RegisterUpdateWorkCenter {
  constructor() {
    this._queryReturn;
  }

  getParameters(req) {
    return {
      workCenterDescription: get(req.body, 'descricao', ''),
      updateId: get(req.params, 'id', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({
    workCenterDescription,
    updateId,
    mysql,
    authData,
  }, type = '') {
    return {
      ...(!workCenterDescription ? { workCenterDescription: 'Descrição do centro de trabalho não informado' } : ''),
      ...(type === 'update' && !updateId ? { updateId: 'Id do centro de trabalho a ser alterado não informado' } : ''),
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

      await this.registerUpdateWorkCenter(parameters, type);
      
      if (!this._queryReturn.affectedRows)
        throw type ? 'Nenhum registro foi alterado' : 'Nenhum registro foi inserido';

      return this._queryReturn;
    } catch (err) {
      console.log('err RegisterUpdateWorkCenter :>> ', err);

      throw err;
    }
  }
  
  async registerUpdateWorkCenter(parameters, type = '') {
    if (type === 'update')
      this._queryReturn = await new WorkCenterDao(parameters).updateWorkCenter();

    else this._queryReturn = await new WorkCenterDao(parameters).registerWorkCenter();
  }

  async validateGroups({ authData }) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
