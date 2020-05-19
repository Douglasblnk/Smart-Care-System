import Update from "../../../../shared/dao/TransactionEpiUpdate";
import {SSUtils} from '../../../../shared/utils/utils';
import {
    TABLE_ORDEM_SERVICO_HAS_EPI
  } from '../../../../shared/enums/database'
const _= require('lodash');

const commitData = new Update();
const isEmpty = new SSUtils();

export default class RegisterOrderEpiValidate {

    async run(event: any) {
        try{
            const data = this.getData(event);
            this.validate(data);

            const getQuery = this.getQuery(data);

            const result = await commitData.run(getQuery); 
            console.log('MEU RESULT:', result);
            
            return result;
        } catch(err) {
            console.log('MEU ERRO:', err);
            throw err;
        }

    }
    getData(evt: any){
        const data = evt.body || undefined;

        return data;
    }
    validate(data: any){
        if(_.isEmpty(data)) throw {
            status: 404,
            err: 'Nao existem dados',
        }
        isEmpty.verify(data, ['order','epi_id'], '');

        if(data.ordemServico_idOrdemServico === '') throw {
            status: 404,
            err:'Número da ordem não informado',
        }
        if(data.Epi_idEpi === '') throw {
            status: 404,
            err:'Id do EPI não informado',
        }
    }
    getQuery(data: any) {
        const values = { checked: 1};
        const where =  data;
        const query = `UPDATE ${TABLE_ORDEM_SERVICO_HAS_EPI} SET ? WHERE Epi_idEpi = ? AND ordemServico_idOrdemServico = ?;`;
        
        const dataQuery = { query, values, where, type: "epi" };
        return dataQuery;
    }
}