import Create from '../../shared/dao/Create';
import {SSUtils} from '../../shared/utils/utils';
const _ = require('lodash');

const commitData = new Create();
const isEmpty = new SSUtils();

const TABLE = 'Sintomas';

export default class RegisterSintomaValidate {

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
      status: 400,
      err: 'Não existem dados!',
    };
    
    isEmpty.verify(data,  ['descricaoSintomas'], '');
    
    if (data.descricaoSintomas === '') throw {
      status: 400,
      err: 'Sintoma não informado',
    };
  }

  getQuery(data: any) {
    const post = { descricaoSintomas: data.descricaoSintomas};
    const query = /*sql*/`INSERT INTO ${TABLE} SET ?;`;

    const dataQuery = { query, post, type: 'Sintoma' };
    console.log(dataQuery);
    return dataQuery;
  }
}