import Delete from '../../dao/Delete';

const comitData = new Delete();

const TABLE = 'equipamento';

export default class DeleteComponentValidate {


    async run(event: any){
        try {
            const data = this.getQuery(event);

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

        const query = `DELETE from ${TABLE} WHERE ${TABLE}.idComponente = ?`;

        const dataQuery = { query, post, type: 'Componente'};

        return dataQuery;

    }
}