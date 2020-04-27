import Get from '../../shared/dao/Get';


const comitData = new Get();

const TABLE = 'Componente';

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
        const query = `SELECT * FROM ${TABLE};`;

        const dataQuery = { query, type: 'equipamento' };

        return dataQuery;
    }
}