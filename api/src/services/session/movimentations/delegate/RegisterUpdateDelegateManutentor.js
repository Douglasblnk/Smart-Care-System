const DelegateManutentorDao = require('../../../dao/cruds/EquipmentsDao');

const { ADMINISTRADOR_ID } = require('../../../../shared/constants/accessLevel');
const { get } = require('lodash');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

module.exports = class RegisterDelegateManutentor {
  constructor() {
    this._queryReturn = '';
  }

  getParameters(req) {
    return {
      idOrdemServico: get(req.body, 'idOrdemServico', ''),
      idUsuario: get(req.body, 'idUsuario', ''),
      excluded: get(req.body, 'excluded', ''),
      updateId: get(req.params, 'id', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({
    idOrdemServico,
    idUsuario,
    excluded,
    updateId,
    mysql,
    authData,
  }, type = '') {
    return {
      ...(!idOrdemServico ? { idOrdemServico: 'Id da ordem serviço não informado' } : ''),
      ...(!idUsuario ? { idUsuario: 'Id usuario não informado' } : ''),
      ...(!excluded ? { excluded: 'Status excluded não informado' } : ''),
      ...(type === 'update' && !updateId ? { updateId: 'Id do usuario a ser alterado não informado' } : ''),
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

      await this.registerDelegateManutentor(parameters, type);
      
      if (!this._queryReturn.affectedRows)
        throw type ? 'Nenhum registro foi alterado' : 'Nenhum registro foi inserido';

      return this._queryReturn;
    } catch (err) {
      console.log('err registerUpdateDelegateManutentor :>> ', err);
      throw err;
    }
  }

  async registerDelegateManutentor(parameters, type = '') {
    if (type === 'update')
      this._queryReturn = await new DelegateManutentorDao(parameters).updateDelegateManutentor();

    else this._queryReturn = await new DelegateManutentorDao(parameters).registerDelegateManutentor();
  }

  async validateGroups({ authData }) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
