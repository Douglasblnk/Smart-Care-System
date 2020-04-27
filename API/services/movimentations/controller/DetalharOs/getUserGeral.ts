import Get from '../../../../shared/dao/Get';

const commitData = new Get();

const TABLE = 'Usuario';

export default class GetUserGeral {

    async run(event: any) {
        try {
            const data = this.getData(event);

            const getQuery = this.getQuery(data);

            const result = await commitData.run(getQuery);

            return result;

        } catch(err) {
            throw err;
        }
    }
    getData(evt: any) {
        const data = evt.body || undefined;

        return data;
    }

    getQuery(data: any) {

        const query = `SELECT * FROM ${TABLE};`;

        const dataQuery = { query, type:'UsuarioGeneral' };

        return dataQuery;
    }
}
