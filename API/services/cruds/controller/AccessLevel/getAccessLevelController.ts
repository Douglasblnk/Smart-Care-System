import Get from '../../../../shared/dao/Get';

const commitData = new Get();

const TABLE = 'NivelAcesso';

export default class GetAccessLevel {

  async run(event: any) {
    try {
      const getQuery = this.getQuery()

      const result = await commitData.run(getQuery);

      return result;
    } catch (err) {
      throw err;
    }
  }


  getQuery() {
    const query = /*sql*/`SELECT * FROM ${TABLE};`;

    const dataQuery = { query, type: 'Nível de Acesso' };
    console.log(dataQuery);
    return dataQuery;
  }
}