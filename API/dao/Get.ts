import { Mysql } from '../database/mysql'
const connection = new Mysql('duasrodasdb.cjh4gc3id4wo.sa-east-1.rds.amazonaws.com', 'adminDuasRodas', 'twowheels2020', 'duasrodas').createConnection()

export default class Get {

  async run(data: any) {
    try {
      console.log('post data', data);

      const response = await this.runQuery(data);

      return response
    } catch (err) {
      console.log('deu erro', err);

      throw err;
    }
  }

  runQuery(data: any) {
    return new Promise((resolve, reject) => {
      connection.query(data.query, data.post || '', (err: any, result: any) => {
        if (err) return reject(err);
        
        console.log('result', result);
        
        if (result.length === 0 || result === undefined) return reject({ status: 404, err: `${data.type} não encontrado!` });
        
        const response = this.getQueryResult(result)
        console.log(response);
        return resolve({ status: 200, result: response });
      });
    });
  }

  getQueryResult(result: any) {
    if (result.length > 1) return JSON.parse(JSON.stringify(result));
    return JSON.parse(JSON.stringify(result[0]))
  }
}
