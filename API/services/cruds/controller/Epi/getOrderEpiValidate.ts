import Create from '../../../../shared/dao/Create';
import Update from "../../../../shared/dao/Update";
import Get from '../../../../shared/dao/Get';

const commitData = new Get();

const TABLE = 'Epi';

export default class GetOrderEpiValidate {

    async run(event : any){
        try {
            const data = this.getData(event);
            const getQuery = this.getQuery(data);
            console.log('ESTE É O MEU Query: ');
            const result = await commitData.run(getQuery);
            console.log('ESTE É O MEU RESULT: ', result);
            return result;

        }catch(err){
            return err;
        }
    }

    getData(evt: any){
        const data = evt.body || undefined;

        return data;
    }

    getQuery(data: any){
        console.log('Meu DATA: ', data);
        const query = `SELECT ordemServico_has_Epi.ordemServico_idOrdemServico,ordemServico_has_Epi.Epi_idEpi,Epi.idEpi,Epi.descricaoEpi FROM
        Epi INNER JOIN ordemServico_has_Epi 
        ON ordemServico_has_Epi.Epi_idEpi = Epi.idEpi 
        WHERE ordemServico_has_Epi.ordemServico_idOrdemServico = ${ data.order}`;

        const dataQuery = { query, type: 'EPI'};

        return dataQuery;
    }
}