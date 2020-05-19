import { Mysql } from '../database/mysql'
import _ from 'lodash';
import { promises } from 'dns';
const connection = new Mysql('duasrodasdb.cjh4gc3id4wo.sa-east-1.rds.amazonaws.com', 'adminDuasRodas', 'twowheels2020', 'duasrodas').createConnection()
const TABLE_OPERATIONS = 'Operacoes';

export default class Dao {

  async run(data: any) {
    try {
      const response = await this.runQuery(data);


      return 'response';
    } catch (err) {
      throw err;
    }
  }

  async runQuery(data: any) {
    try{
      connection.beginTransaction();  

      data[2].post.Ordem_servico = await this.insertGenericReturn(data[0]);

      await this.insertEpisOrder(data[6], data[2].post.Ordem_servico);
  
      data[5].post.Equipamento_FK = await this.insertGenericReturn(data[2]);

      data[3].post.Ordem_Servico = data[2].post.Ordem_servico;

      data[5].post.Locais_FK = await this.insertGenericReturn(data[3]);

      let listOperations : any = await this.insertOperationsOrder(data[4]);
      

      for (const element of listOperations) {
        data[5].post.Operacao_FK = element;
        await this.insertGenericReturn(data[5]);
      }
      
      connection.commit();

      return { result: 'Ordem de serviço criada!' }
    } catch (err) {
      console.log('err runTransaction :>> ', err);
      

      await connection.rollback();
      throw err;
    }
  }

  private async insertGenericReturn(data: any) {
    try {
      return new Promise((resolve, reject) => {
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
    } catch (err) {
      const error = this.getQueryError(err);

      throw error;
    }
  }

  private async insertOperationsOrder(data: any) {
    try {
      return new Promise((resolve, reject) => {
        let listOperations: any = [];
        let response: any;
        for (const item of data.post) {
          connection.query(data.query, item, async (err: any, result: any) =>{
            if (err) reject({ status: 401, msg: 'Não foi possível realizar a operação!', ...err })

            listOperations.push(result.insertId);
            
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