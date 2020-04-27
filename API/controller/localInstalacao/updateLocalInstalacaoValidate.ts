import Update from '../../shared/dao/Update';
import {SSUtils} from '../../shared/utils/utils';
const _ = require('lodash');

const commitData = new Update();
const isEmpty = new SSUtils();

const TABLE = 'Setor';

export default class UpdateLocalInstalacaoValidate {

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
    data.id = evt.params.id || undefined;

    return data;
  }

  validateData(data: any) {
    console.log('data cru', data);
    if (_.isEmpty(data)) throw {
      status: 404,
      err: 'Não existem dados!',
    };

    if (data.id === '' || data.id === undefined) throw {
      status: 404,
      err: 'Não foi possível encontrar o local de instalação!'
    }
    
    isEmpty.verify(data,  ['nome'], '');
    
    if (data.nome === '') throw {
      status: 404,
      err: 'Local Instalação não informado',
    };
  }

  getQuery(data: any) {
    const values = { nome: data.nome };
    const where = data.id;
    const query = /*sql*/`UPDATE ${TABLE} SET ? WHERE ${TABLE}.idSetor = ?;`;

    const dataQuery = { query, values, where, type: 'Local de instalação' };
    console.log(dataQuery);
    return dataQuery;
  }
}