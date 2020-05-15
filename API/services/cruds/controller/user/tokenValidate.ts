import Retrieve from '../../../../shared/dao/Get';

const commitData = new Retrieve();

const TABLE = 'Usuario';

export default class LoginValidate {

  async run(event: any) {
    try {
      const data = this.getData(event);

      const getQuery = this.getQuery(data);

      return await commitData.run(getQuery);

    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  getData(evt: any) {
    const data = evt.body || undefined;

    return data;
  }

  getQuery(data: any) {
    const post = [data.numeroCracha, data.senha];
    const query = /*SQL*/`SELECT * FROM ${TABLE} WHERE ${TABLE}.numeroCracha = ? AND ${TABLE}.senha = ?`;

    const dataQuery = { query, post, type: 'Usuário' };

    return dataQuery;
  }

}