import Get from '../../dao/Get';

const commitData = new Get();

const TABLE = 'ordemServico';

export default class GetOrderMaintenanceValidate {

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

    const dataQuery = { query, type: 'Ordem de manutenção' };
    console.log(dataQuery);
    return dataQuery;
  }
}