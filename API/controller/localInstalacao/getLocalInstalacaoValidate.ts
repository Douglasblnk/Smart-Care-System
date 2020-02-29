import Get from '../../dao/Get';

const commitData = new Get();

const TABLE = 'Setor';

export default class GetLocalInstalacaoValidate {

  async run(event: any) {
    try {
      const getQuery = this.getQuery()

      const result = await commitData.run(getQuery);
      console.log('cheguei até aqui');
      return result;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }


  getQuery() {
    const query = /*sql*/`SELECT * FROM ${TABLE};`;

    const dataQuery = { query, type: 'Local de instalação' };
    console.log(dataQuery);
    return dataQuery;
  }
}