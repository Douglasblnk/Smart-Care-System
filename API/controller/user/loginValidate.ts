import Retrieve from '../../dao/Get';
import {SSUtils} from '../../utils/utils';
const _ = require('lodash');

const commitData = new Retrieve();
const isEmpty = new SSUtils();

const TABLE = 'Usuario';

export default class LoginValidate {

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
    
    isEmpty.verify(data,  ['numeroCracha', 'senha'], '');

    console.log('data editado', data);

    if (data.numeroCracha === '') throw {
      status: 404,
      err: 'Crachá não informado',
    };

    if (data.senha === '') throw {
      status: 404,
      err: 'Senha não informado',
    };
  }

  getQuery(data: any) {
    const post = [data.numeroCracha, data.senha];
    const query = /*SQL*/`SELECT * FROM ${TABLE} WHERE ${TABLE}.numeroCracha = ? AND ${TABLE}.senha = ?;`;

    const dataQuery = { query, post, type: 'Usuário' };

    return dataQuery;
  }

}