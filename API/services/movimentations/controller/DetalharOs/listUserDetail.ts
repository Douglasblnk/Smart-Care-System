import Get from '../../../../shared/dao/Get';


const commitData = new Get();


const TABLE = 'Usuario';

export default class ListUserDetail {

    async run(event: any) {
        try {
           
        const data = this.getData(event);

        const getQuery = this.getQuery(data);
       
        const result = await commitData.run(getQuery);

        return result;
        } catch(err) {
            throw err;
        }
    }

    getData(evt: any) {
       const data = evt.body || undefined;
       return data; 
    }

    getQuery(data: any) {

        const post = [data.idOrdemServico];
      
        const query = /*SQL*/`
            SELECT
                ${TABLE}.idUsuario,
                ${TABLE}.nome,
                ${TABLE}.funcao,
                ${TABLE}.numeroCracha,
                order_user.is_master
            FROM ${TABLE}
            INNER JOIN ordemServico_has_Usuario as order_user ON order_user.Usuario_idUsuario = ${TABLE}.idUsuario
                WHERE order_user.ordemServico_idOrdemServico = ? AND order_user.excluded = 0;
        `;

        const dataQuery = { query, post, type: 'Usuario' };

        console.log('DataQuery: ', dataQuery);

        return dataQuery;
    }

}