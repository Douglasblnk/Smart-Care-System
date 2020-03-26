import Update from '../../dao/Update';
import { SSUtils } from '../../utils/utils';
const _ = require('lodash');

const comitData = new Update();
const isEmpty = new SSUtils();

const TABLE = 'componente';

export default class UpdateComponentValidate {

    async run(event: any) {
        try {
            const data = this.getData(event);

            this.validateData(data);

            const getQuery = this.getQuery(data);

            const result = await comitData.run(getQuery);
            
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
        isEmpty.verify(data, ['description'], '')
        if(data.description === '') throw {
            status: 404,
            err:'Componente não informado'
        };

    }
    getQuery(data: any) {
        const values = { DescricaoComponente: data.description };
        const where = data.id;
        const query = `UPDATE ${TABLE} set ? WHERE idComponente = ?;`;


        const dataQuery = { query, values, where, type: 'componente' };

        return dataQuery;
    }
}