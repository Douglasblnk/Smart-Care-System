import Post from '../../dao/Create';
import { SSUtils } from '../../utils/utils';
const _= require('lodash');

const commitData = new Post();
const isEmpty = new SSUtils();

const TABLE = 'ordemServico_has_Usuario';

export default class RegisterDetalharOS {

    async run(event: any) {
        try {
            const data = this.getData(event);

            this.validateData(data);

            const getQuery = this.getQuery(data);

            const result = await commitData.run(getQuery);

            return result

        } catch(err) {
            throw err;
        }
    }
    getData(evt: any) {
        const data = evt.body || undefined;

        return data;

    }

    validateData(data: any) {
        if(_.isEmpty(data)) throw {
            status: 404,
            err: 'Não veio dados'
        }
        isEmpty.verify(data, ['idOrdemServico', 'idUsuario'], '');

        if(data.idOrdemServico === '') throw {
            status: 404,
            err: 'idOs não encontrado'
        }
        if(data.idUsuario === '') throw {
            status: 404,
            err: 'isUser não encontrado'
        }
    }
    getQuery(data: any) {
        const post = { ordemServico_idOrdemServico: data.idOrdemServico, Usuario_idUsuario: data.idUsuario };
        const query = `INSERT INTO ${TABLE} SET ?;`;

        const dataQuery = { query, post, type: 'Usuário'};

        return dataQuery;
    }
}