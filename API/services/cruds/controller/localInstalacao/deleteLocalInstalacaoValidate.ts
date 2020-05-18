import Update from '../../../../shared/dao/Update';

const commitData = new Update();

const TABLE = 'Setor';

export default class DeleteLocalInstalacaoValidate {

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
      err: 'Local de instalação não informado',
    };
  }

  getQuery(data: any) {
    const values = { excluded: 1 };
    const where = [data];
    const query = `UPDATE ${TABLE} SET ? WHERE ${TABLE}.idSetor = ?;`;

    const dataQuery = { query, values, where, type: 'Local de instalação' };
    console.log(dataQuery);

    return dataQuery;
  }

}