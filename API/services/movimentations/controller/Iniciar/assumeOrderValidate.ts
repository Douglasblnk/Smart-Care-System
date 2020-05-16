import Get from '../../../../shared/dao/Get';
import AssumeOrderTransaction from '../../../../shared/dao/AssumeOrderTransaction'
import _ from 'lodash';

const TABLE_ORDER_HAS_USER = 'ordemServico_has_Usuario';
const TABLE_USER = 'Usuario';

export default class AssumeOrderValidate {
  private getParameters = (event: any) => ({
    nivelAcesso: _.get(event.body, 'nivelAcesso', ''),
    cracha: _.get(event.body, 'cracha', ''),
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
    ...(!orderId ? { orderId: "Valor do 'orderId' não encontrado" } : ''),
  });

  async run(event: any) {
    try {
      const parameters = this.getParameters(event);

      const errors = this.checkParameters(parameters);
      if (Object.keys(errors).length > 0) throw errors;

      await this.validateUsersInOrders(parameters);
      
      const result = await new AssumeOrderTransaction(parameters).runTransaction()

      console.log('result :>> ', result);

      // return result;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  private async validateUsersInOrders(parameters: { cracha: string; nivelAcesso: string, orderId: string }): Promise<any> {
    try {
      const userInOrderQuery = AssumeOrderValidate.getUserInOrderQuery(parameters);

      const { result } : any = await new Get().run(userInOrderQuery);
      
      if (_.isEmpty(result)) return;
            
      if (result.length === undefined && result.is_master)
        throw String('Ordem já assumida!');
      
      const isOrderAssumed = result.some((i: { is_master: string } ) => i.is_master);

      if (isOrderAssumed) throw String('Ordem já assumida!');
    } catch (err) {
      throw err;
    }
  }

  private static getUserInOrderQuery(parameters: { cracha: string; nivelAcesso: string; orderId: string }): object {
    const query = `
      SELECT
        (SELECT numeroCracha from ${TABLE_USER} WHERE idUsuario = Usuario_idUsuario) as cracha,
        ordemServico_idOrdemServico,
        is_master
      FROM ${TABLE_ORDER_HAS_USER}
      WHERE ordemServico_idOrdemServico = ? AND excluded <> 1;
    `;

    const post = [ parameters.orderId ];

    return { query, post };
  }
}
