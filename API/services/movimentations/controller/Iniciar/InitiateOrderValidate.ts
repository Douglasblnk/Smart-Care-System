import Create from '../../../../shared/dao/Create';
import Get from '../../../../shared/dao/Get';
import { SSUtils } from '../../../../shared/utils/utils';
const _ = require('lodash');

const commitData = new Create();
const getData = new Get();

const TABLE_STATUS = 'Status';
const TABLE_ORDEr_HAS_USER = 'ordemServico_has_Usuario';


export default class InitiateOrderValidate {
  private getParameters = (event: any) => ({
    nivelAcesso: _.get(event.body, 'nivelAcesso', ''),
    cracha: _.get(event.body, 'cracha', ''),
    isMaster: _.get(event.body, 'isMaster', ''),
    orderId: _.get(event.body, 'order', ''),
  });

  private checkParameters = ({
    nivelAcesso,
    cracha,
    isMaster,
    orderId,
  } : any = {}) => ({
    ...(!nivelAcesso ? { nivelAcesso: 'Nível de acesso não encontrado' } : ''),
    ...(!cracha ? { cracha: 'Cracha não encontrado' } : ''),
    ...(!isMaster ? { isMaster: "Valor do 'isMaster' não encontrado" } : ''),
    ...(!orderId ? { orderId: "Valor do 'orderId' não encontrado" } : ''),
  });

  async run(event: any) {
    try {
      const parameters = this.getParameters(event);

      const errors = this.checkParameters(parameters);
      if (Object.keys(errors).length > 0) throw errors;

      await InitiateOrderValidate.validateUsersInOrders(parameters);

      // const result = await commitData.run(query);

      // console.log('result :>> ', result);

      // return result;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  private static async validateUsersInOrders(parameters: { isMaster: string; cracha: string; nivelAcesso: string, orderId: string }): Promise<object> {
    try {
      const userInOrderQuery = InitiateOrderValidate.getUserInOrderQuery(parameters);

      const response = getData.run(userInOrderQuery);

      console.log('response => ', response);

      return { userInOrderQuery }
    } catch (err) {
      throw err;
    }
  }

  private static getUserInOrderQuery(parameters: { isMaster: string; cracha: string; nivelAcesso: string; orderId: string }): object {
    const query = `
      SELECT * from ordemServico_has_Usuario
      where ordemServico_idOrdemServico = ?
      AND Usuario_idUsuario = (SELECT idUsuario from Usuario u2 where numeroCracha = ?);
    `;

    const post = [ parameters.orderId, parameters.cracha ];

    return { query, post };
  }
}
