import { Mysql } from '../database/mysql'
const connection = new Mysql('duasrodasdb.cjh4gc3id4wo.sa-east-1.rds.amazonaws.com', 'adminDuasRodas', 'twowheels2020', 'duasrodas').createConnection()

const _ = require('lodash')

export default class Delete {

  async run(data: any) {
    try {
      console.log('post data', data);

      const response = await this.runQuery(data);
      
      console.log('Create', response);

      return response
    } catch (err) {
      console.log('deu erro', err);

      throw err;
    }
  }

  runQuery(data: any) {
    return new Promise((resolve, reject) => {
      connection.query(data.query, data.post, (err: any, result: any) => {
        if (err) {
          console.log("erro: ", err)          
          return reject({ status: 400, err: 'Ocorreu um erro na hora de deletar', detailErr: err.sqlMessage });
        }
        
        console.log('result', result);

        const response: any = this.getQueryResult(result, data.type);

        console.log('cheguei aqui');
        
        if (response.err) return reject(response);
        
        return resolve(response);
      });
    });
  }

  getQueryResult(res: any, type: any) {
    const result = JSON.parse(JSON.stringify(res));
    console.log('result?', result);
    if (_.isEmpty(result)) return { status: 400, err: 'Ocorreu um erro na hora de deletar os dados' };
    if (result && result.affectedRows > 0) return {status: 200, result: `${type} deletado com sucesso!` };
    return { status: 404, err: `Não foi possível encontrar o ${type} para deletar!` };
  }
}
