import { Mysql } from '../database/mysql'
import _ from 'lodash';
import { promises } from 'dns';
const connection = new Mysql('duasrodasdb.cjh4gc3id4wo.sa-east-1.rds.amazonaws.com', 'adminDuasRodas', 'twowheels2020', 'duasrodas').createConnection()
const TABLE_OPERATIONS = 'Operacoes';

export default class Dao {

  async run(data: any) {
    try {
      console.log('Post data Transaction', data);
      const response = await this.runQuery(data);

      console.log('Query response: ', response);

      return 'response';
    } catch (err) {
      throw err;
    }
  }

  async runQuery(data: any) {
    try{
      let equipments_sectors_operations = [];
      connection.beginTransaction();  

      let order_service = await this.insertGenericReturn(data[0]);

      console.log('ORDER SERVICE', order_service);

      await this.insertEpisOrder(data[6], order_service);
  
      for (const equipment_sector_operation of data[2].post) {
        let dataEquipment = await this.returnDataEquipmentOrder(data[2],order_service,equipment_sector_operation.Equipamento);

        let equipment_id = await this.insertGenericReturn(dataEquipment);
        
        let dataSector = await this.returnDataSectorOrder(data[3],order_service,equipment_sector_operation.Local);

        let sector_id = await this.insertGenericReturn(dataSector);
        
        console.log('DATA 4: ', data[4]);
        let listOperations : any = await this.insertOperationsOrder(data[4], equipment_sector_operation);

        let obj = { Equipamentos: equipment_id, Locais: sector_id, Operacao: listOperations}
        equipments_sectors_operations.push(obj);
      }

      for (const equipment_sector_operation of equipments_sectors_operations) {
        for (const operation of equipment_sector_operation.Operacao) {
          let data_equipment_operation = await this.returnEquipmentOperationOrder(equipment_sector_operation,operation,data[5].query);
          
          console.log('DATA 5: ', data_equipment_operation);
          await this.insertGenericReturn(data_equipment_operation);
        }
      }
      
      connection.commit();

      return { result: 'Ordem de serviço criada!' }
    } catch (err) {
      console.log('err runTransaction :>> ', err);

      await connection.rollback()
      throw err;
    }
  }

  private async insertGenericReturn(data: any) {
    try {
      return new Promise((resolve, reject) => {
        console.log('DATA INSERT: ',data);
        connection.query(data.query, data.post,  async (err: any, result: any) =>{
          if (err) reject({ status: 401, msg: 'Não foi possível realizar a operação!', ...err })
          resolve(result.insertId);
        });
      });
    } catch (err) {
      const error = this.getQueryError(err);

      throw error;
    }
  }

  private async returnDataEquipmentOrder(data: any, order: any, Equipamento: any) {
    try {
      let query = data.query;
      let post = { Equipamento: Equipamento, Ordem_servico: order};
      return { query, post, type: 'Equipamentos'};
    } catch (err) {
      const error = this.getQueryError(err);

      throw error;
    }
  }

  private async returnDataSectorOrder(data: any, order: any, Local: any) {
    try {
      let query = data.query;
      let post = { Local: Local, Ordem_servico: order};
      return { query, post, type: 'Locais'};
    } catch (err) {
      const error = this.getQueryError(err);

      throw error;
    }
  }

  private async returnEquipmentOperationOrder(equipment_sector_operation: any, operation: any, query: any) {
    try {
      
      let post = { Equipamento_FK: equipment_sector_operation.Equipamentos, Locais_FK: equipment_sector_operation.Locais,Operacao_FK: operation};
      
      return { query, post, type: 'Equipamentos e Operação'};
    } catch (err) {
      const error = this.getQueryError(err);

      throw error;
    }
  }

  private async insertEpisOrder(data: any, order: any) {
    try {
      return new Promise((resolve, reject) => {
        for (let index = 0; index < data.post.length; index++) {
          data.post[index].ordemServico_idOrdemServico = order;
        }
        for (const epi of data.post) {
          connection.query(data.query, epi, async (err: any, result: any) =>{
            if (err) reject({ status: 401, msg: 'Não foi possível realizar a operação!', ...err })
            resolve('EPIs cadastrados');
          });
        }
      });
      //console.log('response :>> ', response.insertId);
    } catch (err) {
      const error = this.getQueryError(err);

      throw error;
    }
  }

  private async insertOperationsOrder(data: any, operations: any) {
    try {
      return new Promise((resolve, reject) => {
        let listOperations: any = [];
        let response: any;
        for (const item of operations.operationList) {
          connection.query(data.query, item, async (err: any, result: any) =>{
            console.log('ERRO ACONTECEU');
            if (err) reject({ status: 401, msg: 'Não foi possível realizar a operação!', ...err })
            console.log('ERRO Passou', err);
            console.log('Result Passou', result.insertId);
            listOperations.push(result.insertId);
            
            console.log('List Passou', listOperations);
            resolve(listOperations);
          });
        }
      });
    } catch (err) {
      const error = this.getQueryError(err);

      throw error;
    }
  }

  private getQueryError(err: any): { status: number, err: string } {
    const error = Object.assign({}, err);

    if (_.has(error, 'code')) return { status: 400, err: 'Não foi possível concluir a operação!' };
    if (error.code === 'ER_DUP_ENTRY') return { status: 400, err: 'item já cadastrado!' };
    return { status: 400, err: _.get(error, 'message', 'Não foi possível concluir a operação!') }
  }


}