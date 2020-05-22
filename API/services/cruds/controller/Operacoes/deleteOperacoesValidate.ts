import Update from '../../../../shared/dao/Update';
import { TABLE_OPERACAO } from '../../../../shared/enums/database'
const commitData = new Update();


export default class DeleteOperacoesValidate {

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
    console.log('oia so')
    console.log(data)
    return data;
  }

  validateData(data: any) {
    console.log('data cru', data);
    
    if (data === '' || !data) throw {
      status: 404,
      err: 'Operação não informado',
    };
  }

  getQuery(data: any) {
    const values = { excluded: 1};
    const where = data;
    const query = /*sql*/`UPDATE ${TABLE_OPERACAO} SET ? WHERE idoperacao = ?;`;
    console.log(query);
    const dataQuery = { query, values, where, type: 'Operacões' };

    console.log(dataQuery);

    return dataQuery;
  }

}