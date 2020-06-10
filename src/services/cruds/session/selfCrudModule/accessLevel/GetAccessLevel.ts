import AccessLevelDao from '../../../dao/selfCrudModule/AccessLevelDao';

import { Connection } from 'mysql2/promise';
import { get } from 'lodash';

export default class GetAccessLevel {
  _queryResult: any

  constructor() {
    this._queryResult;
  }
  
  private getParameters = (req: { mysql: Connection }): {
    mysql: Connection,
  } => ({
    mysql: get(req, 'mysql'),
  })

  private checkParameters = ({ mysql }: { mysql: Connection }) => ({
    ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
  })

  async run(req: { mysql: Connection }) {
    try {
      const parameters = this.getParameters(req);
  
      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      await this.getAccessLevel(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetAccessLevel :>> ', err);

      throw err;
    }
  }

  private async getAccessLevel(parameters: { mysql: Connection; }) {
    this._queryResult = await new AccessLevelDao(parameters).getAccessLevel();
  }
}
