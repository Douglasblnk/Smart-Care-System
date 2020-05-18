import Transaction from '../../../../shared/dao/TransactionOrder';
import {SSUtils} from '../../../../shared/utils/utils';
const _ = require('lodash');

const commitData = new Transaction();
const isEmpty = new SSUtils();

const TABLE = 'ordemServico';
const TABLE_EQUIPMENT = 'Equipamentos';
const TABLE_OPERATIONS = 'Operacoes';
const TABLE_SECTOR = 'Locais';
const TABLE_EQUIPMENT_OPERATION = 'equipamento_operacao';
const TABLE_EPIS = 'ordemServico_has_Epi';

export default class RegisterOrderMaintenanceValidate {

  async run(event: any) {
    try {

      let queries = [];

      const data = this.getData(event);

      this.validateData(data);

      queries.push(this.getQuery(data));

      queries.push(this.getQueryIdOrder());

      queries.push(this.getQueryEquipmentsRegister(data));

      queries.push(this.getQuerySectorRegister(data));

      queries.push(this.getQueryOperationsRegister(data));

      queries.push(this.getQueryEquipmentOperationRegister(data));

      queries.push(this.getQueryListEPIRegister(data));

      const result = await commitData.run(queries);
     
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
    if (data.operations === '') throw {
      status: 404,
      err: 'Operações não informadas',
  };
  }

  getQuery(data: any) {
    const post = { 
                    titulo: data.title, resumo: data.summary, descricao: data.description, inicioPlanejado: data.plannedStart, 
                    fimPlanejado: data.plannedEnd, requerParada: data.requireStop, dataEmissao: data.beginData, 
                    tipoManutencao_idtipoManutencao: data.typeMaintenance, Prioridade_idPrioridade: data.priority, 
                    Status_idStatus: data.stats
                };
    const query = /*sql*/`INSERT INTO ${TABLE} SET ?;`;

    const dataQuery = { query, post, type: 'Ordem de Manutenção' };
    console.log(dataQuery);
    return dataQuery;
  }

  getQueryIdOrder() {
    const query = `SELECT LAST_INSERT_ID() AS Last_Id;`;

    const dataQueryIdOrder = { query, type: 'Ordem de serviço' };
    
    console.log(dataQueryIdOrder);
    
    return dataQueryIdOrder;
  }

  getQueryEquipmentsRegister(data: any) {
    const post = { Equipamento: data.equipment};
    const query = `INSERT INTO ${TABLE_EQUIPMENT} SET ?;`;

    const dataQuery = { query, post, type: 'Equipamento' };
    
    console.log(dataQuery);
    
    return dataQuery;
  }

  getQueryOperationsRegister(data: any) {
    const post = data.operations;
    
    const query = `INSERT INTO ${TABLE_OPERATIONS} SET ?;`;

    const dataQuery = { query, post, type: 'Operações' };
    
    console.log(dataQuery);
    
    return dataQuery;
  }

  getQuerySectorRegister(data: any) {
    const post = { Local: data.sector};
    
    const query = `INSERT INTO ${TABLE_SECTOR} SET ?;`;

    const dataQuery = { query, post, type: 'Setor' };
    
    console.log(dataQuery);
    
    return dataQuery;
  }

  getQueryEquipmentOperationRegister(data: any) {
    const post = {};
    
    const query = `INSERT INTO ${TABLE_EQUIPMENT_OPERATION} SET ?;`;

    const dataQuery = { query, post, type: 'Equipamentos_Operações' };
    
    console.log(dataQuery);
    
    return dataQuery;
  }

  getQueryListEPIRegister(data: any) {
    const post = data.epis;
    
    const query = `INSERT INTO ${TABLE_EPIS} SET ?;`;

    const dataQuery = { query, post, type: 'EPIs' };
    
    console.log(dataQuery);
    
    return dataQuery;
  }
  
}