import userDao from '../../dao/userDao';
import Criptografy from '../../../../shared/guard/cryptography';

// eslint-disable-next-line no-unused-vars
import { Connection } from 'mysql2/promise';
import { get } from 'lodash';

export default class LoginValidate {
  getParameters = (req: { body: any, mysql: Connection }): {
    numeroCracha: string,
    senha: string,
    mysql: Connection,
  } => ({
    numeroCracha: get(req.body, 'numeroCracha', ''),
    senha: get(req.body, 'senha', ''),
    mysql: get(req, 'mysql'),
  })

  checkParameters = ({ numeroCracha, senha, mysql }: { numeroCracha: string, senha: string, mysql?: Connection }) => ({
    ...(!numeroCracha ? { numeroCracha: 'Crachá não informado' } : ''),
    ...(!senha ? { senha: 'Senha não informada' } : ''),
    ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
  })

  async run(req: { body: any, mysql: Connection }) {
    try {
      const parameters = this.getParameters(req);
  
      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      const user = await new userDao(parameters).makeLogin();
      console.log('user :>> ', user);
      await this.validateUser(parameters, user);
      
      return this.parseResult(user);
    } catch (err) {
      console.log('err loginValidate :>> ', err);

      throw err;
    }
  }

  async validateUser(parameters: { senha: string }, user: { senha: string, }) {
    await new Criptografy().compareHash(parameters.senha, user.senha);
  }

  parseResult = (user: any) => ({
    idUsuario: user.idUsuario,
    numeroCracha: user.numeroCracha,
    nome: user.nome,
    email: user.email,
    funcao: user.funcao,
    nivel_acesso: user.nivel_acesso,
  })
}
