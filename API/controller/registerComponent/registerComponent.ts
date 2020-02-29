import Create from '../../dao/Create';
import {SSUtils} from '../../utils/utils';
const _ = require('lodash');

const commitData = new Create();
const isEmpty = new SSUtils();

const TABLE = 'Componente';

export default class RegisterEquipmentValidate {

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
    
    isEmpty.verify(data,  ['description', 'equipamento_id'], '');
    
    if (data.sector === '') throw {
      status: 404,
      err: 'Descrição do componente não informada',
    };

    if (data.equipment === '') throw {
      status: 404,
      err: 'Equipamento não informado',
    };
  }

  getQuery(data: any) {
    const post = { Equipamento_idEquipamento: data.equipamento_id, DescricaoComponente: data.description};
    const query = /*sql*/`INSERT INTO ${TABLE} SET ?;`;

    const dataQuery = { query, post, type: 'Equipamento' };
    console.log(dataQuery);
    return dataQuery;
  }

}