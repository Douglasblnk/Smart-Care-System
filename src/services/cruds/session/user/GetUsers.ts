import userDao from '../../dao/userDao';

// eslint-disable-next-line no-unused-vars
import { Connection, QueryError } from 'mysql2/promise';
import { get } from 'lodash';
import { Request } from 'express';

export default class GetUsers {
  private getParameters = (req: Request | { body: any, mysql: Connection }): {
    mysql: Connection,
  } => ({
    mysql: get(req, 'mysql'),
  })

  private checkParameters = ({ mysql }: { mysql?: Connection }): Record<string, any> => ({
    ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
  })

  async run(req: Request | { body: any, mysql: Connection }): Promise<any | QueryError> {
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

  private parseResult = (user: Record<string, any>): {
    idUsuario: number
    numeroCracha: string
    nome: string
    email: string
    funcao: string
    nivel_acesso: number
  } => {
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
