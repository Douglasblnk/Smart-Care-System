import Get from '../../../../shared/dao/Get';
import { TABLE_OPERACAO } from '../../../../shared/enums/database'

const commitData = new Get();

export default class GetOperacoesValidate {
  async run() {
    try {
      const getQuery = this.getQuery()

      return await commitData.run(getQuery);
    } catch (err) {

      throw err;
    }
  }

  getQuery() {
    const query = /*sql*/`SELECT * FROM ${TABLE_OPERACAO} WHERE ${TABLE_OPERACAO}.excluded = 0;`;

    const dataQuery = { query, type: 'Operações' };
    return dataQuery;
  }
}