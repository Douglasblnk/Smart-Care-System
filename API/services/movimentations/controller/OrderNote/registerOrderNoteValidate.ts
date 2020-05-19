import Create from '../../../../shared/dao/Create';
import Get from '../../../../shared/dao/Get';
import { SSUtils } from '../../../../shared/utils/utils';
const _ = require('lodash');

const commitData = new Create();
const commitDataVerify = new Get();
const isEmpty = new SSUtils();

const TABLE = 'Apontamento';


export default class RegisterOrderNoteValidate {

  async run(event: any) {
    try {

      const data = this.getData(event);

      this.validateData(data);

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
    
    isEmpty.verify(data,  ['user','order','date','time','description'], '');

    if (data.user === '') throw {
      status: 404,
      err: 'Data de verificação não informado',
    };
    if (data.order === '') throw {
        status: 404,
        err: 'Problema resolvido não informado',
    };
    if (data.date === '') throw {
        status: 404,
        err: 'Ordem de Serviço não informado',
    };
    if (data.time === '') throw {
        status: 404,
        err: 'Tipo de verificação não informado',
    };
    if (data.description === '') throw {
      status: 404,
      err: 'User não encontrado',
    };
  }

  getQuery(data: any) {
    const post = { data: data.date, descricao_atividade: data.description, tempo: data.time, ordemServico_idOrdemServico: data.order, Usuario_idUsuario: data.user};
    const query = `INSERT INTO ${TABLE} SET ?;`;

    const dataQuery = { query, post, type: 'Apontamento' };

    console.log(dataQuery);

    return dataQuery;
  }  

}