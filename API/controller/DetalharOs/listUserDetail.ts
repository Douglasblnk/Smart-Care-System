import Get from '../../dao/Get';


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
        const query = /*SQL*/`SELECT ${TABLE}.idUsuario,${TABLE}.nome,${TABLE}.funcao,${TABLE}.numeroCracha FROM
        ${TABLE} INNER JOIN ordemServico_has_Usuario ON ordemServico_has_Usuario.Usuario_idUsuario = ${TABLE}.idUsuario WHERE ordemServico_has_Usuario.ordemServico_idOrdemServico = ? AND ordemServico_has_Usuario.excluded = 0;`;

        const dataQuery = { query, post, type: 'Usuario'};

        return dataQuery;
    }

}