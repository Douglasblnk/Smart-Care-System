import { Mysql } from '../database/mysql'
import _ from 'lodash';
import { promises } from 'dns';
const connection = new Mysql('duasrodasdb.cjh4gc3id4wo.sa-east-1.rds.amazonaws.com', 'adminDuasRodas', 'twowheels2020', 'duasrodas').createConnection()

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
        console.log('PONTO 1', data.where);
        for (const epi_check of data.where) {
            console.log('PONTO 2');
            await this.updateGenericReturn(data,epi_check);
            
        }
        console.log('PONTO 4');
        connection.commit();

        return { result: 'EPIs checadas com sucesso!' }
    } catch (err) {
      console.log('err runTransaction :>> ', err);
      

      await connection.rollback();
      throw err;
    }
  }

  private async updateGenericReturn(data: any,epi_check: any) {
    console.log('PONTO 3');
    try {
      return new Promise((resolve, reject) => {
        connection.query(data.query, [data.values, epi_check.Epi_idEpi, epi_check.ordemServico_idOrdemServico], (err: any, result: any) => {
            console.log('Err Update alter: ', err);
            if (err) reject({ status: 401, msg: 'Não foi possível realizar a operação!', ...err })
            console.log('Result Update alter: ', result);
            resolve(result.insertId);
        });
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