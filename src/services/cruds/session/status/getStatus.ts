import statusDao from '../../dao/selfCrudModule/StatusDao';

import { Connection } from 'mysql2/promise';
import { get } from 'lodash';

export default class GetStatus {
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

      await this.getStatus(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err getStatus :>> ', err);

      throw err;
    }
  }

  private async getStatus(parameters: { mysql: Connection; }) {
    this._queryResult = await new statusDao(parameters).getStatus();
  }
}
