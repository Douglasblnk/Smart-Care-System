import Get from '../../../../shared/dao/Get';

const commitData = new Get();

const TABLE = 'Usuario';

export default class GetUsersValidate {

  async run(event: any) {
    try {
      const getQuery = this.getQuery()

      const result = await commitData.run(getQuery);

      console.log('get users result', result);
      return result;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  getQuery() {
    const query = /*SQL*/`SELECT * FROM ${TABLE};`

    const dataQuery = { query, type: 'usuários' };

    return dataQuery;
  }
}