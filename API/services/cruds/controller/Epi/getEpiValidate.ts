import Get from '../../../../shared/dao/Get';

const commitData = new Get();

const TABLE = 'epi';

export default class GetEpiValidate {

    async run(event : any){
        try {
            const getQuery = this.getQuery();

            const result = await commitData.run(getQuery);
            return result;

        }catch(err){
            return err;
        }
    }

    getQuery(){
        const query = `SELECT * FROM ${TABLE};`;

        const dataQuery = { query, type: 'epi'};

        return dataQuery;
    }
}