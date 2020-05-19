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
      let equipments_sectors = [];
      connection.beginTransaction();  

      let order_service = await this.insertGenericReturn(data[0]);

      console.log('ORDER SERVICE', order_service);

      await this.insertEpisOrder(data[6], order_service);
  
      for (const equipment_sector of data[2].post) {
        let dataEquipment = await this.returnDataEquipmentOrder(data[2],order_service,equipment_sector.Equipamento);
        
        console.log('DATA EQUIPMENT AQUI: ', dataEquipment);

        let equipment_id = await this.insertGenericReturn(dataEquipment);
        
        let dataSector = await this.returnDataSectorOrder(data[3],order_service,equipment_sector.Local);

        let sector_id = await this.insertGenericReturn(dataSector);

        let obj = { Equipamentos: equipment_id, Locais: sector_id}
        equipments_sectors.push(obj);
      }

      let listOperations : any = await this.insertOperationsOrder(data[4]);

      for (const equipment_sector of equipments_sectors) {
        for (const element of listOperations) {
          data[5].post.Equipamento_FK = equipment_sector.Equipamentos;
          data[5].post.Locais_FK = equipment_sector.Locais;
          data[5].post.Operacao_FK = element;
          await this.insertGenericReturn(data[5]);
        }
      }
      
      connection.commit();

      connection.end();

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
      throw err;
    }
  }

  private async returnDataEquipmentOrder(data: any, order: any, Equipamento: any) {
    try {
      let query = data.query;
      let post = { Equipamento: Equipamento, Ordem_servico: order};
      return { query, post, type: 'Equipamentos'};
    } catch (err) {
      throw err;
    }
  }

  private async returnDataSectorOrder(data: any, order: any, Local: any) {
    try {
      let query = data.query;
      let post = { Local: Local, Ordem_servico: order};
      return { query, post, type: 'Locais'};
    } catch (err) {
      throw err;
    }
  }

  private async insertEpisOrder(data: any, order: any) {
    try {
      return new Promise((resolve, reject) => {
        console.log('MEU DATA EPI', data);
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
      throw err;
    }
  }

  private async insertOperationsOrder(data: any) {
    try {
      return new Promise((resolve, reject) => {
        let listOperations: any = [];
        let response: any;
        for (const item of data.post) {
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
      throw err;
    }
  }

  errorTreatment(error: any) {
    const errorObj = JSON.parse(JSON.stringify(error))
    console.log('to aqui');
    if (_.has(errorObj, 'code')) {
      console.log('to aqui 2');
      if (errorObj.code === 'ER_DUP_ENTRY') return 'Já existem registros com esses dados!'
    }
  }


}