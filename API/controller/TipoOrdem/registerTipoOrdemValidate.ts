import Create from '../../shared/dao/Create';
import {SSUtils} from '../../shared/utils/utils';
const _ = require('lodash');

const commitData = new Create();
const isEmpty = new SSUtils();

const TABLE = 'tipoManutencao';

export default class RegisterTipoOrdemValidate {

  async run(event: any) {
    try {
      const data = this.getData(event);

      this.validateData(data);

      const getQuery = this.getQuery(data);

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
    
    isEmpty.verify(data,  ['tipoOrdem'], '');
    
    if (data.tipoManutencao === '') throw {
      status: 404,
      err: 'Tipo de Ordem não informado',
    };
  }

  getQuery(data: any) {
    const post = { tipoManutencao: data.tipoManutencao };
    const query = /*sql*/`INSERT INTO ${TABLE} SET ?;`;

    const dataQuery = { query, post, type: 'Tipo de Ordem' };
    console.log(dataQuery);
    return dataQuery;
  }
}