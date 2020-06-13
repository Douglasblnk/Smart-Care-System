import MaintenanceOrderDao from '../../dao/orderModule/MaintenanceOrderDao';

import { Connection } from 'mysql2/promise';
import { get } from 'lodash';

export default class GetMaintenanceOrder {
  _queryResult: any

  constructor() {
    this._queryResult;
  }
  
  private getParameters = (req: { headers: any, mysql: Connection }): {
    mysql: Connection,
    type?: string,
    order?: string,
  } => ({
    type: get(req.headers, 'type', ''),
    order: get(req.headers, 'order', ''),
    mysql: get(req, 'mysql'),
  })

  private checkParameters = ({ type, order, mysql }: { type?: string, order?: string, mysql: Connection }) => ({
    ...(type !== 'summary' && !order ? { order: 'Número da Ordem não informado' } : ''),
    ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
  })

  async run(req: { headers: any, mysql: Connection }) {
    try {
      const parameters = this.getParameters(req);
  
      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      await this.getMaintenanceOrder(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err GetMaintenanceOrder :>> ', err);

      throw err;
    }
  }

  private async getMaintenanceOrder(parameters: { type?: string, order?: string, mysql: Connection; }) {
    if (parameters.type === 'summary')
      this._queryResult = await new MaintenanceOrderDao(parameters).getSummaryOrders();

    else this._queryResult = await new MaintenanceOrderDao(parameters).getDetailOrders();
  }
}
