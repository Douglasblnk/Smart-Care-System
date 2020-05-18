import Get from '../../../../shared/dao/Get';

const commitData = new Get();

const TABLE = 'operacao';

export default class GetOperacoesValidate {
  async run() {
    try {
      const getQuery = this.getQuery()

      return await commitData.run(getQuery);
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  getQuery() {
    const query = /*sql*/`SELECT * FROM ${TABLE};`;

    const dataQuery = { query, type: 'Operações' };
    console.log(dataQuery);
    return dataQuery;
  }
}