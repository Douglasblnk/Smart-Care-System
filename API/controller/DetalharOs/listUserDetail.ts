import Get from '../../dao/Get';


const commitData = new Get();


const TABLE = 'Usuario';

export default class ListUserDetail {

    async run(event: any) {
        try {
            console.log('CHEGOU ATE AQUI RONEI');
        const data = this.getData(event);

        // this.validateData(data);

        const getQuery = this.getQuery(data);
        console.log('CHEGOU ATE AQUI RONEI e a merda foi aqui');
        const result = await commitData.run(getQuery);
        console.log('CHEGOU ATE AQUI RONEI hahahahahaahh');
        console.log(result);

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
        console.log(data);
        const post = [data.idOrdemServico];
        const query = /*SQL*/`SELECT ${TABLE}.idUsuario,${TABLE}.nome,${TABLE}.funcao,${TABLE}.nivelAcesso, ${TABLE}.numeroCracha FROM
        ${TABLE} INNER JOIN ordemServico_has_Usuario ON ordemServico_has_Usuario.Usuario_idUsuario = ${TABLE}.idUsuario WHERE ordemServico_has_Usuario.ordemServico_idOrdemServico = ?;`;

        const dataQuery = { query, post, type: 'Usuario'};

        return dataQuery;
    }

}