import Update from '../../dao/Update';
import { SSUtils } from '../../utils/utils';
const _= require('lodash');

const commitData = new Update();
const isEmpty = new SSUtils();

const TABLE = 'ordemServico_has_Usuario';

export default class UpdateDetalheUser {

    async run(event: any) {
        try {

        } catch(err) {
            throw err;
        }
    }

    getData(evt: any) {
        const data = evt.body || undefined;
        data.id = evt.params.id || undefined;

        return data;
    }
    validateData(data: any) {
        if(_.isEmpty(data)) throw {
            status: 404,
            err: 'Não existem dados'
        }
        if(data.id === '') throw {
            status: 404,
            err: 'Não foi recebido Id'
        }
        isEmpty.verify(data, ['StatusManutentor'], '');

        if(data.StatusManutentor === '') throw {
            status: 404,
            err: 'Nenhum dado encontrado'
        }
    }
    getQuery(data: any) {
        const values = { StatusManutentor: data.StatusManutentor };
        const where = data.id;
        const query = `UPDATE ${TABLE} SET ? WHERE idos_has_user = ?;`;

        const dataQuery = { query, values, where, type: 'idos_has_user'};

        return dataQuery;

    }
}