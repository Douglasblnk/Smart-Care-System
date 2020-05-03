import Create from '../../../../shared/dao/Create';
import {SSUtils} from '../../../../shared/utils/utils';
const _ = require('lodash');

const commitData = new Create();
const isEmpty = new SSUtils();

const TABLE = 'Equipamento';

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
    
    isEmpty.verify(data,  ['Setor_idSetor', 'equipamento', 'equipamentoSuperior', 'descricao'], '');
    
    if (data.Setor_idSetor === '') throw {
      status: 404,
      err: 'Local Instalação não informado',
    };

    if (data.equipamento === '') throw {
      status: 404,
      err: 'Equipamento não informado',
    };

    if (data.equipamentoSuperior === '') throw {
      status: 404,
      err: 'Equipamento Superior não informado',
    };

    if (data.descricao === '') throw {
      status: 404,
      err: 'Descrição não informada',
    };
  }

  getQuery(data: any) {
    const post = { Setor_idSetor: data.Setor_idSetor, descricao: data.descricao, equipamento: data.equipamento, equipamentoSuperior: data.equipamentoSuperior };
    const query = /*sql*/`INSERT INTO ${TABLE} SET ?;`;

    const dataQuery = { query, post, type: 'Equipamento' };
    console.log(dataQuery);
    return dataQuery;
  }
}