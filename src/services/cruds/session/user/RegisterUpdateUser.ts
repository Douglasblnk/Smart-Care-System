import userDao from '../../dao/userModule/UserDao';
import Cryptography from '../../../../shared/guard/cryptography';

import { ADMINISTRADOR_ID } from '../../../../shared/constants/accessLevel';
import { authData } from '../../../../shared/types';
import { Connection } from 'mysql2/promise';
import { get } from 'lodash';
import { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } from '../../../../shared/constants/HTTPResponse';

export default class RegisterUpdateUser {
  _queryReturn: any;

  constructor() {
    this._queryReturn;
  }

  private validateEmail = (email: string): boolean => {
    if (!email) return false;
    
    const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(email.toLowerCase());
  }

  private getParameters = (req: { body: any, params: any, mysql: Connection }): {
    numeroCracha: string,
    senha: string,
    nome: string,
    funcao: string,
    email: string,
    nivelAcesso: string,
    updateId: string,
    mysql: Connection,
    authData: authData,
  } => ({
    numeroCracha: get(req.body, 'numeroCracha', ''),
    senha: get(req.body, 'senha', ''),
    nome: get(req.body, 'nome', ''),
    funcao: get(req.body, 'funcao', ''),
    email: get(req.body, 'email', ''),
    nivelAcesso: get(req.body, 'nivelAcesso', ''),
    updateId: get(req.params, 'id', ''),
    mysql: get(req, 'mysql'),
    authData: get(req, 'authData', ''),
  })

  private checkParameters = ({ numeroCracha, senha, nome, funcao, email, nivelAcesso, updateId, mysql, authData }: {
    numeroCracha: string,
    senha: string,
    nome: string,
    funcao: string,
    email: string,
    nivelAcesso: string,
    updateId: string,
    mysql: Connection,
    authData: authData,
  }, type?: string) => ({
    ...(!numeroCracha ? { numeroCracha: 'Crachá não informado' } : ''),
    ...(!senha ? { senha: 'Senha não informada' } : ''),
    ...(!nome ? { nome: 'Nome não informado' } : ''),
    ...(!funcao ? { funcao: 'Funcão não informada' } : ''),
    ...(!this.validateEmail(email) ? { email: 'E-mail não informado ou inválido' } : ''),
    ...(!nivelAcesso ? { nivelAcesso: 'Nivel de acesso não informado' } : ''),
    ...(type === 'update' && !updateId ? { updateId: 'Id do usuário a ser alterado não informado' } : ''),
    ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
    ...(!authData ? { authData: 'Dados de autenticação não encontrados' } : ''),
  })

  async run(req: { body: any, params: any, mysql: Connection }, type?: string) {
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
  
  private async registerUpdateUser(user: any, type?: string) {
    if (type === 'update')
      this._queryReturn = await new userDao(user).updateUser();

    else this._queryReturn = await new userDao(user).registerUser();
  }

  private async getPasswordHash(parameters: {
    numeroCracha: string,
    senha: string,
    nome: string,
    funcao: string,
    email: string,
    nivelAcesso: string,
    updateId: string,
    mysql: Connection,
  }) {
    const _hash: string = await new Cryptography().generateHash(parameters.senha);

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

  private async validateGroups({ authData }: { authData: authData}) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
}
