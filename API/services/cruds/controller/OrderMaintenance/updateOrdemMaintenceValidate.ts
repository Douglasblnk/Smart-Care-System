import Update from '../../../../shared/dao/Update';
import Get from '../../../../shared/dao/Get';
import { SSUtils } from '../../../../shared/utils/utils';
import { TABLE_ORDEM_SERVICO } from '../../../../shared/enums/database'
import { TABLE_USUARIO } from '../../../../shared/enums/database';

const _ = require('lodash');
const isEmpty = new SSUtils();

const update = new Update();
const commitDataGet = new Get();
export default class UpdateOrdemMaintenceValidate {

  async run(event : any) {
    try {
      const data = this.getData(event);
      this.validateData(data);
      const NivelAcessoUser = this.getQueryNivelUser(data);
      const { result }: any = await commitDataGet.run(NivelAcessoUser);
      
      if (result.nivel_acesso === 1 || result.nivel_acesso === 3) {
        this.validateData(data);
        const getQuery = this.getQuery(data);
        const result = await update.run(getQuery);
        return result
      } else throw {
        status: 404 ,
        err: 'Usuário não pode deletar ordem de serviço'
      }
      
    } catch (err) {
      throw err;
    }

  }
  getData(evt: any) {
    const data = evt.body || undefined;
    data.id = evt.params.id || undefined;
    return data;
  }
  validateData(data: any) {
    if (_.isEmpty(data)) throw {
      status: 404,
      err: 'Não existe dados'
    }
    if (data.id === '' || data.id === undefined) throw {
      status: 404,
      err: 'Não foi possivel encontrar a ordem'
    }
  }
  getQuery(data: any) {
    const values = { excluded: 1};
    const where = data.id;
    const query = `UPDATE ${TABLE_ORDEM_SERVICO} SET ? WHERE ${TABLE_ORDEM_SERVICO}.idOrdemServico = ?;`;
    const dataQuery = { query, values, where, type: 'ordem de manutenção'};
    return dataQuery;
  }
  getQueryNivelUser(data: any) {
    const query = `SELECT * FROM ${TABLE_USUARIO} WHERE ${TABLE_USUARIO}.idUsuario = ${data.userId};`;
    const dataQuery = { query, type: 'Usuario'};

    return dataQuery;
  }
}