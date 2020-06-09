import userDao from '../../../dao/userModule/UserDao';
import Criptografy from '../../../../../shared/guard/cryptography';
import JwtToken from '../../../../../shared/auth/auth';

// eslint-disable-next-line no-unused-vars
import { Connection } from 'mysql2/promise';
import { get } from 'lodash';

export default class LoginValidate {
  _queryResult: any

  constructor() {
    this._queryResult;
  }

  private getParameters = (req: { body: any, mysql: Connection }): {
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
    mysql: Connection
  }) => ({
    ...(!numeroCracha ? { numeroCracha: 'Crachá não informado' } : ''),
    ...(!senha ? { senha: 'Senha não informada' } : ''),
    ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
  })

  async run(req: { body: any, mysql: Connection }) {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      await this.makeLogin(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err loginValidate :>> ', err);

      throw err;
    }
  }

  private async makeLogin(parameters: { numeroCracha: string; senha: string; mysql: Connection; }) {
    const user = await new userDao(parameters).makeLogin();

    await this.validateUser(parameters, user);
    const token = await this.createToken(user);

    console.log('validated :>> ', user.nome);

    this._queryResult = this.parseResult(user, token);
  }

  private createToken(user: any) {
    return new JwtToken().jwtToken(user);
  }

  private async validateUser(parameters: { senha: string }, user: { senha: string, }) {
    await new Criptografy().compareHash(parameters.senha, user.senha);
  }

  private parseResult = (user: any, token: string): {
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
