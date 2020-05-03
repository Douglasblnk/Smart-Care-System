import Get from '../../../../shared/dao/Get';

const commitData = new Get();

const TABLE = 'Status';

export default class GetEquipmentValidate {

  async run(event: any) {
    try {
      console.log("Super certo 1")
      const getQuery = this.getQuery()
      console.log("Super certo 2")
      const result = await commitData.run(getQuery);
      console.log("Super certo 3")
      console.log('cheguei até aqui');
      return result;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }
  
  getQuery() {
    const query = /*sql*/`SELECT * FROM ${TABLE};`;

    const dataQuery = { query, type: 'Status' };
    console.log(dataQuery);
    return dataQuery;
  }
}