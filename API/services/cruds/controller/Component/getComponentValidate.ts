import Get from '../../../../shared/dao/Get';
import { TABLE_COMPONENTE } from '../../../../shared/enums/database';

const comitData = new Get();


export default class GetComponentValidate {


    async run(event: any) {
        try {
            const getQuery = this.getQuery();

            const result = await comitData.run(getQuery);

            return result;

        } catch(err){

            throw err;
        }
    }
    getQuery(){
        const query = `SELECT * FROM ${TABLE_COMPONENTE} WHERE ${TABLE_COMPONENTE}.excluded = 0 ;`;

        const dataQuery = { query, type: 'equipamento' };

        return dataQuery;
    }
}