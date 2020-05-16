import Create from '../../../../shared/dao/Create';
import Get from '../../../../shared/dao/Get';
import { SSUtils } from '../../../../shared/utils/utils';
const _ = require('lodash');

const commitData = new Create();
const commitDataVerify = new Get();
const isEmpty = new SSUtils();

const TABLE = 'Verificacao';


export default class RegisterVericationValidate {

  async run(event: any) {
    try {

      const data = this.getData(event);

      this.validateData(data);

      const getQueryExistVerification = this.getQueryExistVerification(data);

      const resultVerify : any = await commitDataVerify.run(getQueryExistVerification);

      console.log(resultVerify);
      console.log('Length', resultVerify.result.length, !resultVerify.result)
      if(resultVerify.result.length !== 0) throw 'Verificação já realizada!'
      
      console.log("RESULT1");

      const getQuery = this.getQuery(data)

      const result = await commitData.run(getQuery);
      console.log('cheguei até aqui');
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
    
    isEmpty.verify(data,  ['dateVerification','resolved','order','typeVerification'], '');

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
  }

  getQuery(data: any) {
    const post = { solucaoRealizada: data.solutionDescription, dataVerificacao: data.dateVerification, problemaResolvido: data.resolved, ordemServico_idOrdemServico: data.order, tipoVerificacao: data.typeVerification};
    const query = /*sql*/`INSERT INTO ${TABLE} SET ?;`;

    const dataQuery = { query, post, type: 'Verificação' };
    console.log(dataQuery);
    return dataQuery;
  }

  getQueryExistVerification(data: any) {
    const query = /*sql*/`SELECT * FROM ${TABLE} WHERE Verificacao.ordemServico_idOrdemServico = ${data.order} AND Verificacao.tipoVerificacao = ${data.typeVerification};`;

    const dataQuery = { query, type: 'Verificação' };
    console.log(dataQuery);
    return dataQuery;
  }

}