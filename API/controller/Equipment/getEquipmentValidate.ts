import Get from '../../shared/dao/Get';

const commitData = new Get();

const TABLE = 'Equipamento';

export default class GetEquipmentValidate {

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

    const dataQuery = { query, type: 'Equipamento' };
    console.log(dataQuery);
    return dataQuery;
  }
}