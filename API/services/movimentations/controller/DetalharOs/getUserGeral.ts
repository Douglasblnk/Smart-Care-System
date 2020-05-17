import Get from '../../../../shared/dao/Get';

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
    
        const query = `SELECT ${TABLE}.idUsuario,${TABLE}.nome,${TABLE}.funcao,${TABLE}.numeroCracha, ${TABLE}.nivel_acesso 
                        FROM ${TABLE}
                        WHERE Usuario.nivel_acesso = 2 AND ${TABLE}.excluded = 0 AND
                        NOT EXISTS (
                        SELECT * FROM ordemServico_has_Usuario
                        WHERE ordemServico_has_Usuario.Usuario_idUsuario = ${TABLE}.idUsuario 
                        AND ordemServico_has_Usuario.ordemServico_idOrdemServico = ${data.idOrdemServico}
                        AND ordemServico_has_Usuario.excluded = 0);`

        const dataQuery = { query, type:'Usuário Geral' };

        return dataQuery;
    }
}
