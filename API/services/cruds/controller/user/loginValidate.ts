import Retrieve from '../../../../shared/dao/Get';
import {SSUtils} from '../../../../shared/utils/utils';
import Cryptography from '../../../../shared/cryptography/cryptography';

const _ = require('lodash');

const commitData = new Retrieve();
const isEmpty = new SSUtils();
const cryptography = new Cryptography();

const TABLE = 'Usuario';

export default class LoginValidate {

  async run(event: any) {
    try {
      const data = this.getData(event);
      
      this.validateData(data);

      const getQuery = this.getQuery(data)

      var  { result }  : any = await commitData.run(getQuery);

      await cryptography.compareHash(data.senha, result.senha);

      result = { result : result };

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
    const post = [data.numeroCracha];
    const query = /*SQL*/`SELECT * FROM ${TABLE} WHERE ${TABLE}.numeroCracha = ?`;

    const dataQuery = { query, post, type: 'Usuário' };

    return dataQuery;
  }

}