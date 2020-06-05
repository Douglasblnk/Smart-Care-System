import userDao from '../../dao/userDao';
import Criptografy from '../../../../shared/guard/cryptography';
import JwtToken from '../../../../shared/auth/auth';

// eslint-disable-next-line no-unused-vars
import { Connection, QueryError } from 'mysql2/promise';
import { get } from 'lodash';
import { Request } from 'express';

export default class LoginValidate {
  private getParameters = (req: Request | { body: any, mysql: Connection }): {
    numeroCracha: string,
    senha: string,
    mysql: Connection,
  } => ({
    numeroCracha: get(req.body, 'numeroCracha', ''),
    senha: get(req.body, 'senha', ''),
    mysql: get(req, 'mysql'),
  })

  private checkParameters = ({ numeroCracha, senha, mysql }: {
    numeroCracha: string,
    senha: string,
    mysql?: Connection
  }): Record<string, unknown> => ({
    ...(!numeroCracha ? { numeroCracha: 'Crachá não informado' } : ''),
    ...(!senha ? { senha: 'Senha não informada' } : ''),
    ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
  })

  async run(req: Request | { body: any, mysql: Connection }): Promise<any | QueryError> {
    try {
      const parameters = this.getParameters(req);
  
      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      const user = await new userDao(parameters).makeLogin();

      await this.validateUser(parameters, user);
      const token = await this.createToken(user);

      console.log('validated :>> ', user);

      return this.parseResult(user, token);
    } catch (err) {
      console.log('err loginValidate :>> ', err);

      throw err;
    }
  }

  private createToken(user: any) {
    return new JwtToken().jwtToken(user);
  }

  private async validateUser(parameters: { senha: string }, user: { senha: string, }) {
    await new Criptografy().compareHash(parameters.senha, user.senha);
  }

  private parseResult = (user: Record<string, any>, token: string): {
    idUsuario: number,
    numeroCracha: string,
    nome: string,
    email: string,
    funcao: string,
    nivel_acesso: number,
    token: string,
  } => ({
    idUsuario: user.idUsuario,
    numeroCracha: user.numeroCracha,
    nome: user.nome,
    email: user.email,
    funcao: user.funcao,
    nivel_acesso: user.nivel_acesso,
    token,
  })
}
