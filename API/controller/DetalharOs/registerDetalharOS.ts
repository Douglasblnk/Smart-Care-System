import Post from '../../shared/dao/Create';
import Get from '../../shared/dao/Get';
import Update from '../../shared/dao/Update';

import { SSUtils } from '../../shared/utils/utils';
const _= require('lodash');

const commitData = new Post();
const commitDataGet = new Get();
const commitDataUpdate = new Update();

const isEmpty = new SSUtils();

const TABLE = 'ordemServico_has_Usuario';

export default class RegisterDetalharOS {

    async run(event: any) {
        try {

            const data = this.getData(event);

            this.validateData(data);

            const queryGet = this.queryGet(data);

            const { result } : any = await commitDataGet.run(queryGet);

            if(result.length === undefined && result.excluded === 1) {
                console.log('oi ai');
                const queryUpdate = this.queryUpdate(data);
                const result2 = await commitDataUpdate.run(queryUpdate);
                return result2;
                
            }else {
                const queryInsert = this.getQuery(data);
                const resulta = await commitData.run(queryInsert)
                return resulta; 
            }


        }catch(err) {

            throw err;
        }
    }
    getData(evt: any) {
        const data = evt.body || undefined;

        return data;

    }

    validateData(data: any) {
        if(_.isEmpty(data)) throw {
            status: 404,
            err: 'Não veio dados'
        }
        isEmpty.verify(data, ['idOrdemServico', 'idUsuario', 'excluded'], '');

        if(data.idOrdemServico === '') throw {
            status: 404,
            err: 'idOs não encontrado'
        }
        if(data.idUsuario === '') throw {
            status: 404,
            err: 'isUser não encontrado'
        }
        if(data.excluded === '') throw {
            status: 404,
            err: 'excluded não encontrado'
        }
    }
    getQuery(data: any) {
        const post = { ordemServico_idOrdemServico: data.idOrdemServico, Usuario_idUsuario: data.idUsuario, excluded: data.excluded };
        const query = `INSERT INTO ${TABLE} SET ?;`;

        const dataQuery = { query, post, type: 'register User detail'};

        return dataQuery;
    }
 
    queryGet(data: any) {
        const post= {ordemServico_idOrdemServico:data.idOrdemServico};
        const query =`select ${TABLE}.excluded from ${TABLE} where ${TABLE}.ordemServico_idOrdemServico = ${data.idOrdemServico} and ${TABLE}.Usuario_idUsuario = ${data.idUsuario};`;

        
        const dataQuery = { query, post, type: 'Usuario'};

        return dataQuery;
    }
    queryUpdate(data: any) {
        const values = { excluded: 0 };
        const where =  [data.idOrdemServico];
        const query = `UPDATE ordemServico_has_Usuario SET ? WHERE ordemServico_has_Usuario.ordemServico_idOrdemServico = ? AND ordemServico_has_Usuario.Usuario_idUsuario = ${data.idUsuario};`;
        const dataQuery = { query, values, where, type: 'Manutentor'};

        return dataQuery;
    }
}