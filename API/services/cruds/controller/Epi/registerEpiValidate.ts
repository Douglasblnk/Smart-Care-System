import Create from '../../../../shared/dao/Create';
import {SSUtils} from '../../../../shared/utils/utils';
const _= require('lodash');

const commitData = new Create();
const isEmpty = new SSUtils();

const TABLE = 'Epi';


export default class RegisterEpiValidate {

    async run(event: any) {
        try{
            const data = this.getData(event);
            this.validate(data);

            const getQuery = this.getQuery(data);

            const result = await commitData.run(getQuery); 

            return result;
        } catch(err) {
            throw err;
        }

    }
    getData(evt: any){
        const data = evt.body || undefined;

        return data;
    }
    validate(data: any){
        if(_.isEmpty(data)) throw {
            status: 404,
            err: 'Nao existem dados',
        }
        isEmpty.verify(data, ['descricaoEpi'], '');

        if(data.descricaoEpi === '') throw {
            status: 404,
            err:'Nome EPI não informado',
        }

    }
    getQuery(data: any) {
        const post = {descricaoEpi: data.descricaoEpi};
        const query = `INSERT INTO ${TABLE} SET ?;`;

        const dataQuery = {query, post, type: 'epi'}
        return dataQuery;
    }
}