import Create from '../../dao/Create';
import {SSUtils} from '../../utils/utils';
const _ = require('lodash');

const commitData = new Create();
const isEmpty = new SSUtils();

const TABLE = 'Setor';

export default class RegisterLocalInstalacaoValidate {

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
    
    isEmpty.verify(data,  ['nome'], '');
    
    if (data.nome === '') throw {
      status: 400,
      err: 'Local Instalação não informado',
    };
  }

  getQuery(data: any) {
    const post = { nome: data.nome };
    const query = /*sql*/`INSERT INTO ${TABLE} SET ?;`;

    const dataQuery = { query, post, type: 'Local Instalação' };
    console.log(dataQuery);
    return dataQuery;
  }
}