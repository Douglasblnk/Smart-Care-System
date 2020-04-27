import Create from '../../shared/dao/Create';
import {SSUtils} from '../../shared/utils/utils';
const _ = require('lodash');

const commitData = new Create();
const isEmpty = new SSUtils();

const TABLE = 'ordemServico';

export default class RegisterOrderMaintenanceValidate {

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
    
    isEmpty.verify(data,  ['orderType'], '');

    if (data.title === '') throw {
      status: 404,
      err: 'Título não informado',
    };
    if (data.summary === '') throw {
        status: 404,
        err: 'Resumo não informado',
    };
    if (data.description === '') throw {
        status: 404,
        err: 'Descrição não informado',
    };
    if (data.plannedStart === '') throw {
        status: 404,
        err: 'Inicio Planejado não informado',
    };
    if (data.plannedEnd === '') throw {
        status: 404,
        err: 'Fim Planejado  não informado',
    };
    if (data.requireStop === '') throw {
        status: 404,
        err: 'Requer parada não informado',
    };
    if (data.beginData === '') throw {
        status: 404,
        err: 'Data de Inicio não informado',
    };
    if (data.equipment === '') throw {
        status: 404,
        err: 'Equipamento não informado',
    };
    if (data.typeMaintenance === '') throw {
        status: 404,
        err: 'Tipo Manutenção não informado',
    };
    if (data.sector === '') throw {
        status: 404,
        err: 'Setor não informado',
    };
    if (data.priority === '') throw {
        status: 404,
        err: 'Prioridade não informado',
    };
    if (data.stats === '') throw {
        status: 404,
        err: 'Status não informado',
    };
    if (data.superiorEquipment === '') throw {
        status: 404,
        err: 'Equipamento Superior não informado',
    };
  }

  getQuery(data: any) {
    const post = { 
                    titulo: data.title, resumo: data.summary, descricao: data.description, inicioPlanejado: data.plannedStart, 
                    fimPlanejado: data.plannedEnd, requerParada: data.requireStop, dataEmissao: data.beginData, Equipamento_idEquipamento: data.equipment,
                    tipoManutencao_idtipoManutencao: data.typeMaintenance, Setor_idSetor: data.sector, Prioridade_idPrioridade: data.priority, 
                    Status_idStatus: data.stats
                };
    const query = /*sql*/`INSERT INTO ${TABLE} SET ?;`;

    const dataQuery = { query, post, type: 'Ordem de Manutenção' };
    console.log(dataQuery);
    return dataQuery;
  }
}