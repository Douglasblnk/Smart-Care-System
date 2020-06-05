import userDao from '../../dao/userDao';
import Cryptography from '../../../../shared/guard/cryptography';

import { ADMINISTRADOR_ID } from '../../../../shared/constants/accessLevel';
import { authData } from '../../../../shared/types';
import { Connection } from 'mysql2/promise';
import { get } from 'lodash';
import { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } from '../../../../shared/constants/HTTPResponse';

export default class LoginValidate {
  private validateEmail = (email: string): boolean => {
    if (!email) return false;
    
    const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(email.toLowerCase());
  }

  private getParameters = (req: { body: any, mysql: Connection }): {
    numeroCracha: string,
    senha: string,
    nome: string,
    funcao: string,
    email: string,
    nivelAcesso: string,
    mysql: Connection,
    authData: authData,
  } => ({
    numeroCracha: get(req.body, 'numeroCracha', ''),
    senha: get(req.body, 'senha', ''),
    nome: get(req.body, 'nome', ''),
    funcao: get(req.body, 'funcao', ''),
    email: get(req.body, 'email', ''),
    nivelAcesso: get(req.body, 'nivelAcesso', ''),
    mysql: get(req, 'mysql'),
    authData: get(req, 'authData', ''),
  })

  private checkParameters = ({ numeroCracha, senha, nome, funcao, email, nivelAcesso, mysql, authData }: {
    numeroCracha: string,
    senha: string,
    nome: string,
    funcao: string,
    email: string,
    nivelAcesso: string,
    mysql?: Connection,
    authData: authData,
  }): Record<string, unknown> => ({
    ...(!numeroCracha ? { numeroCracha: 'Crachá não informado' } : ''),
    ...(!senha ? { senha: 'Senha não informada' } : ''),
    ...(!nome ? { nome: 'Nome não informado' } : ''),
    ...(!funcao ? { funcao: 'Funcão não informada' } : ''),
    ...(!this.validateEmail(email) ? { email: 'E-mail não informado ou inválido' } : ''),
    ...(!nivelAcesso ? { nivelAcesso: 'Nivel de acesso não informado' } : ''),
    ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
    ...(!authData ? { authData: 'Dados de autenticação não encontrados' } : ''),
  })

  async run(req: { body: any, mysql: Connection }): Promise<any> {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;
      
      await this.validateGroups(parameters);

      const user = await this.getPasswordHash(parameters);

      const response = await new userDao(user).registerUser();

      console.log('user registered :>> ', response);
      return response;
    } catch (err) {
      console.log('err registerUser :>> ', err);

      throw err;
    }
  }

  private async getPasswordHash(parameters: {
    numeroCracha: string,
    senha: string,
    nome: string,
    funcao: string,
    email: string,
    nivelAcesso: string,
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
      mysql: parameters.mysql,
    };
  }

  private async validateGroups({ authData }: { authData: authData}) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
}
