import Get from '../../dao/Get';

const commitData = new Get();

const TABLE = 'Usuario';

export default class GetUserGeral {

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
        console.log("passou aqui ronei 182");
        const post = [data.idOrdemServico];
        const query = `SELECT * FROM ${TABLE};`;
        // `SELECT ${TABLE}.idUsuario,${TABLE}.nome,${TABLE}.funcao,${TABLE}.nivelAcesso, ${TABLE}.numeroCracha,ordemServico_has_Usuario.excluded FROM
        // Usuario INNER JOIN ordemServico_has_Usuario ON ordemServico_has_Usuario.Usuario_idUsuario = ${TABLE}.idUsuario where ordemServico_has_Usuario.ordemServico_idOrdemServico != ?;`;

        const dataQuery = { query, post, type:'UsuarioGeneral' };

        return dataQuery;
    }
}
