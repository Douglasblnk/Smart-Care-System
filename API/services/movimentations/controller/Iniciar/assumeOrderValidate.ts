import Get from '../../../../shared/dao/Get';
import AssumeOrderTransaction from '../../../../shared/dao/AssumeOrderTransaction'
import _ from 'lodash';

import { 
  TABLE_USUARIO,
  TABLE_ORDEM_SERVICO_HAS_USUARIO,
  TABLE_NIVEL_ACESSO
 } from '../../../../shared/enums/database'

import { 
  ACCESS_LEVEL_MANUTENTOR
 } from '../../../../shared/enums/accessLevel'

export default class AssumeOrderValidate {
  private getParameters = (event: any) => ({
    nivelAcesso: _.get(event.body, 'nivelAcesso', ''),
    userId: _.get(event.body, 'userId', ''),
    orderId: _.get(event.body, 'order', ''),
  });

  private checkParameters = ({
    nivelAcesso,
    userId,
    orderId,
  } : any = {}) => ({
    ...(!nivelAcesso ? { nivelAcesso: 'Nível de acesso não encontrado' } : ''),
    ...(!userId ? { userId: 'userId não encontrado' } : ''),
    ...(!orderId ? { orderId: "Valor do 'orderId' não encontrado" } : ''),
  });

  async run(event: any) {
    try {
      const parameters = this.getParameters(event);

      const errors = this.checkParameters(parameters);
      if (Object.keys(errors).length > 0) throw errors;

      await this.validateUsersInOrders(parameters);
      await this.validateUserAccess(parameters);
      
      const result = await new AssumeOrderTransaction().runTransaction(parameters)

      return result;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  private async validateUsersInOrders(parameters: { userId: number; nivelAcesso: string, orderId: string }): Promise<void> {
    try {
      const userInOrderQuery = this.getUserInOrderQuery(parameters);

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

  private async validateUserAccess(parameters: { nivelAcesso: string; }) {
    try {
      const userAccessLevelQuery = this.getUserAccessLevelQuery();

      const { result }: any = await new Get().run(userAccessLevelQuery);
      if (_.isEmpty(result)) return;

      const assumeAccessLevel = result.find((i: { nivel_acesso_description: string }) => i.nivel_acesso_description === ACCESS_LEVEL_MANUTENTOR)

      if (assumeAccessLevel.nivel_acesso !== parameters.nivelAcesso)
        throw String('O usuário não tem permissão para assumir a ordem!')
    } catch (err) {
      throw err;
    }
  }

  private getUserInOrderQuery(parameters: { orderId: string }): { query: string, post: string[] } {
    const query = `
      SELECT
        (SELECT numeroCracha from ${TABLE_USUARIO} WHERE idUsuario = Usuario_idUsuario) as cracha,
        ordemServico_idOrdemServico,
        is_master
      FROM ${TABLE_ORDEM_SERVICO_HAS_USUARIO}
      WHERE ordemServico_idOrdemServico = ? AND excluded <> 1;
    `;

    const post = [ parameters.orderId ];

    return { query, post };
  }

  private getUserAccessLevelQuery(): { query: string } {
    const query = `
      SELECT
        nivel_acesso,
        nivel_acesso_description
      FROM ${TABLE_NIVEL_ACESSO};
    `;

    return { query };
  }
}
