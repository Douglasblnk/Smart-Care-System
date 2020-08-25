import Create from '../../../../shared/dao/Create';
import Get from '../../../../shared/dao/Get';
import Update from "../../../../shared/dao/Update";
import { SSUtils } from '../../../../shared/utils/utils';
import {
  TABLE_ORDEM_SERVICO,
  TABLE_VERIFICACAO,
  TABLE_USUARIO,
  TABLE_ORDEM_SERVICO_HAS_USUARIO
} from '../../../../shared/enums/database';

const _ = require('lodash');

const commitDataVerify = new Get();
const isEmpty = new SSUtils();




export default class RegisterVericationValidate {

  async run(event: any) {
    try {

      const data = this.getData(event);

      const getQueryVerificationStatus = this.getQueryVerificationStatus(data);
      const resultVerify : any = await commitDataVerify.run(getQueryVerificationStatus);
      
      return resultVerify;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  getData(evt: any) {
    const data = evt.body || undefined;

    return data;
  }

  getQueryVerificationStatus(data: any) {
    const query = `
                    SELECT ${TABLE_VERIFICACAO}.tipoVerificacao, ${TABLE_VERIFICACAO}.ordemServico_idOrdemServico, 
                    ${TABLE_VERIFICACAO}.dataVerificacao,${TABLE_VERIFICACAO}.problemaResolvido, 
                    ${TABLE_ORDEM_SERVICO}.Status_idStatus, ${TABLE_ORDEM_SERVICO}.tipoManutencao_idtipoManutencao, 
                    ${TABLE_ORDEM_SERVICO}.reporte,  ${TABLE_ORDEM_SERVICO}.solicitante, ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.Usuario_idUsuario,
                    ${TABLE_ORDEM_SERVICO}.resumo,${TABLE_ORDEM_SERVICO}.descricao,
                    ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.is_master,
                    user_report.nome AS name_report,
                    user_requester.nome AS name_requester,
                    user_maintainer.nome AS name_maintainer
                    FROM ${TABLE_VERIFICACAO}
                INNER JOIN ${TABLE_ORDEM_SERVICO} ON ${TABLE_ORDEM_SERVICO}.idOrdemServico = ${TABLE_VERIFICACAO}.ordemServico_idOrdemServico 
                INNER JOIN ${TABLE_ORDEM_SERVICO_HAS_USUARIO} ON ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.ordemServico_idOrdemServico = ${TABLE_VERIFICACAO}.ordemServico_idOrdemServico
                INNER JOIN ${TABLE_USUARIO} AS user_report ON user_report.idUsuario = ${TABLE_ORDEM_SERVICO}.reporte
                INNER JOIN ${TABLE_USUARIO} AS user_requester ON user_requester.idUsuario = ${TABLE_ORDEM_SERVICO}.solicitante
                INNER JOIN ${TABLE_USUARIO} AS user_maintainer ON user_maintainer.idUsuario =  ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.Usuario_idUsuario 
                WHERE ${TABLE_ORDEM_SERVICO}.Status_idStatus = 6 AND ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.is_master = 1;
    `;

    const dataQuery = { query, type: 'Verificação' };

    console.log(dataQuery);

    return dataQuery;
  }

}