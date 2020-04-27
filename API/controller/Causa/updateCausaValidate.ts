import Update from '../../shared/dao/Update';
import {SSUtils} from '../../shared/utils/utils';
const _ = require('lodash');

const commitData = new Update();
const isEmpty = new SSUtils();

const TABLE = 'causa';

export default class UpdateCausaValidate {

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
      err: 'Não foi possível encontrar o equipamento!'
    }
    
    isEmpty.verify(data,  ['descricaoCausa'], '');
    
    if (data.descricaoCausa === '') throw {
      status: 404,
      err: 'Causa não informado',
    };
  }

  getQuery(data: any) {
    const values = { descricaoCausa: data.descricaoCausa };
    const where = data.id;
    const query = /*sql*/`UPDATE ${TABLE} SET ? WHERE idCausa = ?;`;

    const dataQuery = { query, values, where, type: 'Causa' };
    console.log(dataQuery);
    return dataQuery;
  }
}