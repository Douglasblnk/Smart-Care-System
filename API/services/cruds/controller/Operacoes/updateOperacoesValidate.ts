import Update from '../../../../shared/dao/Update';
import {SSUtils} from '../../../../shared/utils/utils';
import { TABLE_OPERACAO } from '../../../../shared/enums/database'
const _ = require('lodash');

const commitData = new Update();
const isEmpty = new SSUtils();

const TABLE = 'Equipamento';

export default class UpdateOperacoesValidate {

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
    
    isEmpty.verify(data,  ['descricao_operacao', 'material', 'quantidade_material', 'unidade_material', 'tempo_planejado'], '');
    
    if (data.descricao_operacao === '') throw {
      status: 400,
      err: 'Descrição da operação não informado',
    };
    if (data.Material === '') throw {
      status: 400,
      err: 'material não informado',
    };
    if (data.quantidade_material === '') throw {
      status: 400,
      err: 'Quantidade do material não informado',
    };
    if (data.unidade_material === '') throw {
      status: 400,
      err: 'Unidade do material não informado',
    };
    if (data.tempo_planejado === '') throw {
      status: 400,
      err: 'Tempo Planejado não informado',
    };
  }

  getQuery(data: any) {
    const values = { descricao_operacao: data.descricao_operacao, material: data.material, quantidade_material: data.quantidade_material, unidade_material: data.unidade_material, tempo_planejado: data.tempo_planejado};
    const where = data.id;
    const query = /*sql*/`UPDATE ${TABLE_OPERACAO} SET ? WHERE idoperacao = ?;`;

    const dataQuery = { query, values, where, type: 'Operacões' };
    console.log(dataQuery);
    return dataQuery;
  }
}