import Update from '../../../../shared/dao/Update';

const commitData = new Update();

const TABLE = 'Epi';

export default class DeleteEpiValidate {

    async run(event: any) {
        try {
            const data = this.getData(event);
            this.validate(data);
            const getQuery = this.getQuery(data);
            const result = await commitData.run(getQuery);

            return result;
        } catch(err) {
            throw err;
        }

    }
    getData(evt: any) {
        const data = evt.params.id || undefined
        return data;
    }
    validate(data: any) {
        if(data === '' || !data) throw {
            status: 404,
            err: 'Epi não informado',
        }
    }
    getQuery(data: any) {
        const values = { excluded: 1 };
        const where = [data];
        const query = `UPDATE ${TABLE} SET ? WHERE ${TABLE}.idEpi = ?;`;

        const dataQuery = { query, values, where, type: 'Epi' };

        return dataQuery;
    }
}