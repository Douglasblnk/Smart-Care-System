import userDao from '../../dao/userDao';

// eslint-disable-next-line no-unused-vars
import { Connection } from 'mysql2/promise';
import { get } from 'lodash';

export default class GetUsers {
  private getParameters = (req: { body: any, mysql: Connection }): {
    mysql: Connection,
  } => ({
    mysql: get(req, 'mysql'),
  })

  private checkParameters = ({ mysql }: { mysql?: Connection }) => ({
    ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
  })

  async run(req: { body: any, mysql: Connection }) {
    try {
      const parameters = this.getParameters(req);
  
      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      const user = await new userDao(parameters).getUsers();

      return this.parseResult(user);
    } catch (err) {
      console.log('err getUsers :>> ', err);

      throw err;
    }
  }

  private parseResult = (user: any) => {
    return user.map((i: any) => ({
      idUsuario: i.idUsuario,
      numeroCracha: i.numeroCracha,
      nome: i.nome,
      email: i.email,
      funcao: i.funcao,
      nivel_acesso: i.nivel_acesso,
    }));
  }
}
