import Post from '../../dao/Create';
import Get from '../../dao/Get';
import Update from '../../dao/Update';

import { SSUtils } from '../../utils/utils';
const _= require('lodash');

const commitData = new Post();
const commitDataGet = new Get();
const commitDataUpdate = new Update();

const isEmpty = new SSUtils();

const TABLE = 'ordemServico_has_Usuario';
const TABLE1 = 'Usuario';

export default class RegisterDetalharOS {

    // async run(event: any) {
    //     try {

    //         const data = this.getData(event);

    //         this.validateData(data);

    //         const getQuery = this.getQuery(data);

    //         const result = await commitData.run(getQuery);

    //         return result

    //     } catch(err) {
    //         throw err;
    //     }
    // }
    async run(event: any) {
        try {
            const data = this.getData(event);
            const queryGet = this.queryGet(data)
            const resulte = await commitDataGet.run(queryGet)
            console.log(resulte);
            if(resulte === null) {
               return console.log("usuario disponivel para adicionar");
            }
         
            // if(resulte === 1 and resulte != ''){
            //     const queryUpdate = this.queryUpdate(data);
            //     const result2 = await commitDataUpdate.run(queryUpdate);

            // }
            // const queryInsert = this.getQuery(data);
            // const result = await commitData.run(queryInsert)
            // return result;

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
        isEmpty.verify(data, ['idOrdemServico', 'idUsuario'], '');

        if(data.idOrdemServico === '') throw {
            status: 404,
            err: 'idOs não encontrado'
        }
        if(data.idUsuario === '') throw {
            status: 404,
            err: 'isUser não encontrado'
        }
    }
    getQuery(data: any) {
        const post = { ordemServico_idOrdemServico: data.idOrdemServico, Usuario_idUsuario: data.idUsuario, excluded: data.excluded };
        const query = `INSERT INTO ${TABLE} SET ?;`;

        const dataQuery = { query, post, type: 'Usuário'};

        return dataQuery;
    }
    queryGet(data: any) {
        const post= [data.idOrdemServico,data.idUsuario];
        const query =`select ${TABLE}.excluded from ${TABLE} where ${TABLE}.ordemServico_idOrdemServico = ? and ${TABLE}.Usuario_idUsuario = ?;`;
        // `SELECT ${TABLE1}.idUsuario,${TABLE1}.nome,${TABLE1}.funcao,${TABLE1}.nivelAcesso,${TABLE1}.numeroCracha,ordemServico_has_Usuario.excluded FROM
        // ${TABLE1} INNER JOIN ordemServico_has_Usuario ON ordemServico_has_Usuario.Usuario_idUsuario = ${TABLE1}.idUsuario where ${TABLE}.ordemServico_idOrdemServico = ? AND ${TABLE}.Usuario_idUsuario = ?;`;
        
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