import Create from '../../dao/Create';
import {SSUtils} from '../../utils/utils';
const _ = require('lodash');

const commitData = new Create();
const isEmpty = new SSUtils();

const TABLE = 'Centro_Trabalho';

export default class RegisterCentroTrabalhoValidate {

  async run(event: any) {
    try {
      const data = this.getData(event);

      this.validateData(data);

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
    
    isEmpty.verify(data,  ['descricao_centro_trabalho'], '');
    
    if (data.descricao_centro_trabalho === '') throw {
      status: 404,
      err: 'Centro de trabalho não informado',
    };
  }

  getQuery(data: any) {
    const post = { descricao_centro_trabalho: data.descricao_centro_trabalho };
    const query = /*sql*/`INSERT INTO ${TABLE} SET ?;`;

    const dataQuery = { query, post, type: 'Centro de Trabalho' };
    console.log(dataQuery);
    return dataQuery;
  }
}