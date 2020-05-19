import Update from '../../../../shared/dao/Update';
import {SSUtils} from '../../../../shared/utils/utils';
const _ = require('lodash');

const commitData = new Update();
const isEmpty = new SSUtils();

const TABLE = 'Centro_Trabalho';

export default class UpdateEquipmentValidate {

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

    if (data.id_centro_trabalho === '' || data.id === undefined) throw {
      status: 404,
      err: 'Não foi possível encontrar o equipamento!'
    }
    
    isEmpty.verify(data,  ['descricao'], '');
    
    if (data.descricao === '') throw {
      status: 404,
      err: 'Centro de trabalho não informado',
    };
  }

  getQuery(data: any) {
    const values = { descricao: data.descricao };
    const where = data.id_centro_trabalho;
    const query = /*sql*/`UPDATE ${TABLE} SET ? WHERE id_centro_trabalho = ?;`;

    const dataQuery = { query, values, where, type: 'Centro de trabalho' };
    console.log(dataQuery);
    return dataQuery;
  }
}