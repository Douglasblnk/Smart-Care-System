import Get from '../../../../shared/dao/Get';

const commitData = new Get();

const TABLE = 'Usuario';

export default class GetUserRequesterValidate {

  async run(event: any) {
    try {
      const getQuery = this.getQuery()

      const result = await commitData.run(getQuery);

      return result;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  getQuery() {
    const post = [1];
    const query = `SELECT idUsuario,numeroCracha,nome,nivel_acesso FROM ${TABLE} WHERE nivel_acesso = ?;`

    const dataQuery = { query, post, type: 'Usuários' };

    return dataQuery;
  }
}