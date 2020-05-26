import Create from '../../../../shared/dao/Create';
import {SSUtils} from '../../../../shared/utils/utils';
import { TABLE_OPERACAO } from '../../../../shared/enums/database'
const _ = require('lodash');

const commitData = new Create();
const isEmpty = new SSUtils();


export default class RegisterOperacoesValidate {

  async run(event: any) {
    try {
      const data = this.getData(event);

      this.validateData(data);

      const getQuery = this.getQuery(data)

      const result = await commitData.run(getQuery);

      return result;
    } catch (err) {

      throw err;
    }
  }

  getData(evt: any) {
    const data = evt.body || undefined;

    return data;
  }

  validateData(data: any) {

    if (_.isEmpty(data)) throw {
      status: 400,
      err: 'Não existem dados!',
    };
    
    isEmpty.verify(data,  ['descricao_operacao', 'material', 'quantidade_material', 'unidade_material', 'tempo_planejado'], '');
    
    if (data.descricao_operacao === '') throw {
      status: 400,
      err: 'Descrição da operação não informado',
    };
    if (data.material === '') throw {
      status: 400,
      err: 'Material não informado',
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
    const post = { descricao_operacao: data.descricao_operacao, material: data.material, quantidade_material: data.quantidade_material, unidade_material: data.unidade_material, tempo_planejado: data.tempo_planejado };
    const query = /*sql*/`INSERT INTO ${TABLE_OPERACAO} SET ?;`;

    const dataQuery = { query, post, type: 'Operacões' };
    return dataQuery;
  }
}