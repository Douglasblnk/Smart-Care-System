import { Mysql } from '../database/mysql'
const connection = new Mysql('duasrodasdb.cjh4gc3id4wo.sa-east-1.rds.amazonaws.com', 'adminDuasRodas', 'twowheels2020', 'duasrodas').createConnection()

const _ = require('lodash')

export default class Create {

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
          const error = this.getQueryError(err, data.type);
          
          return reject(error);
        }
        
        console.log('result', result);

        const response: any = this.getQueryResult(result, data.type);

        console.log('cheguei aqui');
        
        if (response.err) return reject(response.err);
        
        return resolve(response);
      });
    });
  }

  getQueryError(err: any, type: string) {
    const error = JSON.parse(JSON.stringify(err));
    if (!_.has(error, 'code')) return { status: 400, err: 'Ocorreu um erro na hora de salvar os dados' };
    if (error.code === 'ER_DUP_ENTRY') return { status: 400, err: `${type} já cadastrado!` };
  }

  getQueryResult(res: any, type: any) {
    const result = JSON.parse(JSON.stringify(res));
    if (_.isEmpty(result)) return { status: 400, err: 'Ocorreu um erro na hora de salvar os dados' };
    if (result && result.affectedRows > 0) return { status: 200, result: `${type} cadastrado com sucesso!` };
    return { status: 400, err: 'Ocorreu um erro na hora de salvar os dados' };
  }
}
