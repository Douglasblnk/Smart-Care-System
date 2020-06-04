import userDao from '../../dao/userDao';

// eslint-disable-next-line no-unused-vars
import { Connection } from 'mysql2/promise';
import { get } from 'lodash';
import Cryptography from '../../../../shared/guard/cryptography';

export default class LoginValidate {  
  private validateEmail = (email: string) => {
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
  } => ({
    numeroCracha: get(req.body, 'numeroCracha', ''),
    senha: get(req.body, 'senha', ''),
    nome: get(req.body, 'nome', ''),
    funcao: get(req.body, 'funcao', ''),
    email: get(req.body, 'email', ''),
    nivelAcesso: get(req.body, 'nivelAcesso', ''),
    mysql: get(req, 'mysql'),
  })

  private checkParameters = ({ numeroCracha, senha, nome, funcao, email, nivelAcesso, mysql }: {
    numeroCracha: string,
    senha: string,
    nome: string,
    funcao: string,
    email: string,
    nivelAcesso: string,
    mysql?: Connection
  }) => ({
    ...(!numeroCracha ? { numeroCracha: 'Crachá não informado' } : ''),
    ...(!senha ? { senha: 'Senha não informada' } : ''),
    ...(!nome ? { nome: 'Nome não informado' } : ''),
    ...(!funcao ? { funcao: 'Funcão não informada' } : ''),
    ...(!this.validateEmail(email) ? { email: 'E-mail não informado ou inválido' } : ''),
    ...(!nivelAcesso ? { nivelAcesso: 'Nivel de acesso não informado' } : ''),
    ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
  })

  async run(req: { body: any, mysql: Connection }) {
    try {
      const parameters = this.getParameters(req);
  
      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      const user = await this.getPasswordHash(parameters);

      const response = await new userDao(user).registerUser();

      console.log('user registered :>> ', response);
      return this.parseResult(response);
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

  private parseResult = (user: any) => ({
    idUsuario: user.idUsuario,
    numeroCracha: user.numeroCracha,
    nome: user.nome,
    email: user.email,
    funcao: user.funcao,
    nivel_acesso: user.nivel_acesso,
  })
}
