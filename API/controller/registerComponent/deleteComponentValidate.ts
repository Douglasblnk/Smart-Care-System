import Delete from '../../shared/dao/Delete';

const comitData = new Delete();

const TABLE = 'Componente';

export default class DeleteComponentValidate {


    async run(event: any){
        try {
            const data = this.getData(event);

            this.validateData(data);

            const getQuery = this.getQuery(data);

            const result = await comitData.run(getQuery);

            return result;

        } catch(err) {
            throw err;
        }
    }
    getData(evt: any) {
        const data = evt.params.id || undefined;

        return data;
    }
    validateData(data: any){
        if(data === '' || !data) throw {
            status: 404,
            err:'Componente não encontrado'
        };
    }
    getQuery(data: any) {
        const post = [data];
        
        const query = `DELETE FROM ${TABLE} WHERE ${TABLE}.idComponente = ?`;

        const dataQuery = { query, post, type: 'Componente'};

        return dataQuery;

    }
}