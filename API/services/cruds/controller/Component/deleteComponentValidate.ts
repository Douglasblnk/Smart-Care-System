import Update from '../../../../shared/dao/Update';
import { TABLE_COMPONENTE } from '../../../../shared/enums/database';
const comitData = new Update();



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
        const data = evt.body || undefined;
        data.id = evt.params.id || undefined

        return data;
    }
    validateData(data: any){
        if(data === '' || !data) throw {
            status: 404,
            err:'Componente não encontrado'
        };
    }
    getQuery(data: any) {
        
        const values = { excluded: 1};
        const where = data.id;
        const query = `UPDATE ${TABLE_COMPONENTE} SET ? WHERE ${TABLE_COMPONENTE}.idComponente = ?;`;

        const dataQuery = { query, values, where, type: 'Componente'};

        return dataQuery;

    }
}