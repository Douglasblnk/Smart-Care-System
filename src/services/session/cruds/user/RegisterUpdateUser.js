const userDao = require('../../../dao/cruds/UserDao');
const { generateHash } = require('../../../../shared/guard/cryptography');

const { ADMINISTRADOR_ID } = require('../../../../shared/constants/accessLevel');
const { get } = require('lodash');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

module.exports = class RegisterUpdateUser {
  constructor() {
    this._queryReturn;
  }

  validateEmail(email) {
    if (!email) return false;
    
    // eslint-disable-next-line max-len
    const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(email.toLowerCase());
  }

  getParameters(req) {
    return {
      numeroCracha: get(req.body, 'numeroCracha', ''),
      senha: get(req.body, 'senha', ''),
      nome: get(req.body, 'nome', ''),
      funcao: get(req.body, 'funcao', ''),
      email: get(req.body, 'email', ''),
      nivelAcesso: get(req.body, 'nivelAcesso', ''),
      updateId: get(req.params, 'id', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({
    numeroCracha,
    senha,
    nome,
    funcao,
    email,
    nivelAcesso,
    updateId,
    mysql,
    authData,
  } = {}, type = '') {
    return {
      ...(!numeroCracha ? { numeroCracha: 'Crachá não informado' } : ''),
      ...(!senha ? { senha: 'Senha não informada' } : ''),
      ...(!nome ? { nome: 'Nome não informado' } : ''),
      ...(!funcao ? { funcao: 'Funcão não informada' } : ''),
      ...(!this.validateEmail(email) ? { email: 'E-mail não informado ou inválido' } : ''),
      ...(!nivelAcesso ? { nivelAcesso: 'Nivel de acesso não informado' } : ''),
      ...(type === 'update' && !updateId ? { updateId: 'Id do usuário a ser alterado não informado' } : ''),
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

      const user = await this.getPasswordHash(parameters);
      await this.registerUpdateUser(user, type);
      
      if (!this._queryReturn.affectedRows)
        throw type ? 'Nenhum registro foi alterado' : 'Nenhum registro foi inserido';

      return this._queryReturn;
    } catch (err) {
      console.log('err registerUser :>> ', err);

      throw err;
    }
  }
  
  async registerUpdateUser(parameters, type = '') {
    if (type === 'update')
      this._queryReturn = await new userDao(parameters).updateUser();

    else this._queryReturn = await new userDao(parameters).registerUser();
  }

  async getPasswordHash(parameters) {
    const _hash = await generateHash(parameters.senha);

    return {
      numeroCracha: parameters.numeroCracha,
      senha: _hash,
      nome: parameters.nome,
      funcao: parameters.funcao,
      email: parameters.email,
      nivelAcesso: parameters.nivelAcesso,
      updateId: parameters.updateId,
      mysql: parameters.mysql,
    };
  }

  async validateGroups({ authData }) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
