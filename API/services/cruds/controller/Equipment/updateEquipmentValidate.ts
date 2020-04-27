import Update from '../../../../shared/dao/Update';
import {SSUtils} from '../../../../shared/utils/utils';
const _ = require('lodash');

const commitData = new Update();
const isEmpty = new SSUtils();

const TABLE = 'Equipamento';

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

    if (data.id === '' || data.id === undefined) throw {
      status: 404,
      err: 'Não foi possível encontrar o equipamento!'
    }
    
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
      status: 400,
      err: 'Equipamento Superior não informado',
    };

    if (data.descricao === '') throw {
      status: 400,
      err: 'Descrição não informada',
    };
  }

  getQuery(data: any) {
    const values = { Setor_idSetor: data.Setor_idSetor, descricao: data.descricao, equipamento: data.equipamento, equipamentoSuperior: data.equipamentoSuperior };
    const where = data.id;
    const query = /*sql*/`UPDATE ${TABLE} SET ? WHERE idEquipamento = ?;`;

    const dataQuery = { query, values, where, type: 'Equipamento' };
    console.log(dataQuery);
    return dataQuery;
  }
}