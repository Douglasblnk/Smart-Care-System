import Update from '../../../../shared/dao/Update';
import { SSUtils } from '../../../../shared/utils/utils';
const _ = require('lodash');

const commitData = new Update();
const isEmpty = new SSUtils();

const TABLE = 'Componente';

export default class UpdateComponentValidate {

    async run(event: any) {
        try {
            console.log('entrou nesta parte');
            const data = this.getData(event);

            this.validateData(data);

            const getQuery = this.getQuery(data);

            const result = await commitData.run(getQuery);
            
            return result;

        } catch(err){
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
            err: "Não existem dados"
        };

        if(data.id === '' || data.id === undefined) throw {
            status: 404,
            err: 'NAo foi possivel encontrar o componente'
        };
        isEmpty.verify(data, ['DescricaoComponente'], '');
        if(data.DescricaoComponente === '') throw {
            status: 404,
            err:'Componente não informado'
        };

    }
    getQuery(data: any) {
        const values = { DescricaoComponente: data.DescricaoComponente };
        const where = data.id;
        const query = `UPDATE ${TABLE} SET ? WHERE idComponente = ?;`;


        const dataQuery = { query, values, where, type: 'Componente' };

        return dataQuery;
    }
}