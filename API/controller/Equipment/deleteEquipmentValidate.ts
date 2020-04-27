import Delete from '../../shared/dao/Delete';

const commitData = new Delete();

const TABLE = 'Equipamento';

export default class DeleteEquipmentValidate {

  async run(event: any) {
    try {
      const data = this.getData(event);

      this.validateData(data);

      const getQuery = this.getQuery(data)

      const result = await commitData.run(getQuery);
      console.log('cheguei até aqui');
      return result;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  getData(evt: any) {
    const data = evt.params.id || undefined;

    return data;
  }

  validateData(data: any) {
    console.log('data cru', data);
    
    if (data === '' || !data) throw {
      status: 404,
      err: 'Equipamento não informado',
    };
  }

  getQuery(data: any) {
    const post = [data];
    const query = /*SQL*/`DELETE from ${TABLE} WHERE ${TABLE}.idEquipamento = ?`

    const dataQuery = { query, post, type: 'Equipamento' };

    console.log(dataQuery);

    return dataQuery;
  }

}