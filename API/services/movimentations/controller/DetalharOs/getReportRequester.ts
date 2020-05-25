import Get from '../../../../shared/dao/Get';
import {
    TABLE_ORDEM_SERVICO,
    TABLE_USUARIO
  } from '../../../../shared/enums/database';

const commitData = new Get();

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
    
        const query = `SELECT	
                            ${TABLE_USUARIO}.idUsuario,
                            ${TABLE_USUARIO}.nome,
                            ${TABLE_USUARIO}.funcao,
                            ${TABLE_USUARIO}.numeroCracha,
                            ${TABLE_USUARIO}.nivel_acesso
                       FROM ${TABLE_USUARIO}
                       INNER JOIN ${TABLE_ORDEM_SERVICO} as order_service ON order_service.idOrdemServico = ${data.idOrdemServico}
                       WHERE ${TABLE_USUARIO}.idUsuario = order_service.reporte OR ${TABLE_USUARIO}.idUsuario = order_service.solicitante;`

        const dataQuery = { query, type:'Usuário Geral' };

        return dataQuery;
    }
}
