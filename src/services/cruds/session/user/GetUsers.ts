import userDao from '../../dao/UserDao';

import { Connection } from 'mysql2/promise';
import { get } from 'lodash';

export default class GetUsers {
  _queryResult: any

  constructor() {
    this._queryResult;
  }
  
  private getParameters = (req: { headers: any, mysql: Connection }): {
    type?: string,
    mysql: Connection,
  } => ({
    type: get(req.headers, 'type', ''),
    mysql: get(req, 'mysql'),
  })

  private checkParameters = ({ mysql }: { mysql: Connection }) => ({
    ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
  })

  async run(req: { headers: any, mysql: Connection }) {
    try {
      const parameters = this.getParameters(req);
  
      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      await this.getUsers(parameters);

      return this.parseResult(this._queryResult);
    } catch (err) {
      console.log('err getUsers :>> ', err);

      throw err;
    }
  }

  private async getUsers(parameters: { type?: string, mysql: Connection; }) {
    if (parameters.type === 'reporter')
      this._queryResult = await new userDao(parameters).getReporterUser();

    else if (parameters.type === 'requester')
      this._queryResult = await new userDao(parameters).getRequesterUser();
    
    else this._queryResult = await new userDao(parameters).getUsers();
  }

  private parseResult = (user: any) => {
    if (!Array.isArray(user) && user.length === undefined) {
      return {
        idUsuario: user.idUsuario,
        numeroCracha: user.numeroCracha,
        nome: user.nome,
        email: user.email,
        funcao: user.funcao,
        nivel_acesso: user.nivel_acesso,
      };
    }
    
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
