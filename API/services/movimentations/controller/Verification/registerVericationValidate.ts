import Create from '../../../../shared/dao/Create';
import Get from '../../../../shared/dao/Get';
import Update from "../../../../shared/dao/Update";
import { SSUtils } from '../../../../shared/utils/utils';
import {
  TABLE_ORDEM_SERVICO,
} from '../../../../shared/enums/database';

const _ = require('lodash');

const commitData = new Create();
const commitDataVerify = new Get();
const commitDataUpdate = new Update();
const isEmpty = new SSUtils();

const TABLE = 'Verificacao';
const TABLE_USER = 'Usuario';
const TABLE_ORDER_USER = 'ordemServico_has_Usuario'



export default class RegisterVericationValidate {

  async run(event: any) {
    try {

      const data = this.getData(event);

      this.validateData(data);

      const getQueryExistVerification = this.getQueryExistVerification(data);
      const resultVerify : any = await commitDataVerify.run(getQueryExistVerification);
      let verify_master = 1;

      if(data.typeVerification === 2){
        const getQueryIsMasterVerification = this.getQueryIsMasterVerification(data);
        const resultIsMasterVerification : any = await commitDataVerify.run(getQueryIsMasterVerification);

        if (resultIsMasterVerification.result.length == 0) verify_master = 0
        if(verify_master == 0) throw 'Usuário não é o responsável pela ordem!'

        const getQueryStatus = this.getQueryStatus(data);
        const status = await commitDataUpdate.run(getQueryStatus);
      }
      
      if(resultVerify.result.length !== 0) throw 'Verificação já realizada!'

      if(data.typeVerification === 1){
        const getQueryVerificationMaintainerRequester = this.getQueryExistVerificationMaintainerRequester(data);

        const resultVerificationMaintainerRequester : any = await commitDataVerify.run(getQueryVerificationMaintainerRequester);

        if (resultVerificationMaintainerRequester.result.length === 0
            || resultVerificationMaintainerRequester.result.length === undefined) throw 'A verificações pendentes!'

        const getQueryStatusReport = this.getQueryStatusReport(data);
        const status = await commitDataUpdate.run(getQueryStatusReport);
      }

      const getQuery = this.getQuery(data);

      const result = await commitData.run(getQuery);
      
      return result;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  getData(evt: any) {
    const data = evt.body || undefined;

    return data;
  }

  validateData(data: any) {
    console.log('data cru', data);
    if (_.isEmpty(data)) throw {
      status: 404,
      err: 'Não existem dados!',
    };
    
    isEmpty.verify(data,  ['dateVerification','resolved','order','typeVerification','cracha'], '');

    if (data.dateVerification === '') throw {
      status: 404,
      err: 'Data de verificação não informado',
    };
    if (data.resolved === '') throw {
        status: 404,
        err: 'Problema resolvido não informado',
    };
    if (data.order === '') throw {
        status: 404,
        err: 'Ordem de Serviço não informado',
    };
    if (data.typeVerification === '') throw {
        status: 404,
        err: 'Tipo de verificação não informado',
    };
    if (data.cracha === '') throw {
      status: 404,
      err: 'User não encontrado',
    };
  }

  getQuery(data: any) {
    const post = { solucaoRealizada: data.solutionDescription, dataVerificacao: data.dateVerification, problemaResolvido: data.resolved, ordemServico_idOrdemServico: data.order, tipoVerificacao: data.typeVerification};
    const query = `INSERT INTO ${TABLE} SET ?;`;

    const dataQuery = { query, post, type: 'Verificação' };

    console.log(dataQuery);

    return dataQuery;
  }

  getQueryStatus(data: any) {
    const values = { Status_idStatus: 6};
    const where = data.order;
    const query = `UPDATE ${TABLE_ORDEM_SERVICO} SET ? WHERE idOrdemServico = ?;`;

    const dataQuery = { query, values, where, type: "Ordem de serviço" };

    return dataQuery;
  }

  getQueryStatusReport(data: any) {
    const values = { Status_idStatus: 3};
    const where = data.order;
    const query = `UPDATE ${TABLE_ORDEM_SERVICO} SET ? WHERE idOrdemServico = ?;`;

    const dataQuery = { query, values, where, type: "Ordem de serviço" };

    return dataQuery;
  }

  getQueryExistVerificationMaintainerRequester(data: any) {
    const query = `SELECT * FROM ${TABLE} WHERE Verificacao.ordemServico_idOrdemServico = ${data.order};`;

    const dataQuery = { query, type: 'Verificação' };

    console.log(dataQuery);

    return dataQuery;
  }

  getQueryExistVerification(data: any) {
    const query = `SELECT * FROM ${TABLE} WHERE Verificacao.ordemServico_idOrdemServico = ${data.order} AND Verificacao.tipoVerificacao = ${data.typeVerification};`;

    const dataQuery = { query, type: 'Verificação' };

    console.log(dataQuery);

    return dataQuery;
  }

  getQueryIsMasterVerification(data: any) {
    const post = { numeroCracha: data.cracha, ordemServico_idOrdemServico: data.order};

    const query = `SELECT user_verification.numeroCracha AS cracha,
                  user_verification.idUsuario AS id_usuario,
                  users_order.is_master AS is_master,
                  users_order.Usuario_idUsuario AS user_id_fk,
                  users_order.ordemServico_idOrdemServico AS order_user_id
                  FROM ${TABLE_USER} AS user_verification
                  INNER JOIN ${TABLE_ORDER_USER} AS users_order
                  ON user_verification.idUsuario = users_order.Usuario_idUsuario
                  WHERE user_verification.numeroCracha = ${data.cracha}
                  AND users_order.ordemServico_idOrdemServico = ${data.order}
                  AND users_order.is_master = 1`;

    const dataQuery = { query, post, type: 'Usuário' };

    console.log(dataQuery);

    return dataQuery;

  }

}