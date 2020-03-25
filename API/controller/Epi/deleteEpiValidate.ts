import Delete from '../../dao/Delete';

const commitData = new Delete();

const TABLE = 'epi';

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
        const post = [data];
        const query = `DELETE FROM ${TABLE} WHERE ${TABLE}.idEpi= ?;`;

        const dataQuery = {query, post, type: 'epi'};

        return dataQuery;
    }
}