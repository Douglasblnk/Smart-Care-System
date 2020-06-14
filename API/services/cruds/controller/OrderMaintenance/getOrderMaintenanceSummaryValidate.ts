import Get from '../../../../shared/dao/Get';
import { TABLE_USUARIO, TABLE_ORDEM_SERVICO_HAS_USUARIO } from '../../../../shared/enums/database';

const commitData = new Get();

const TABLE_ORDEM_SERVICO = 'ordemServico';
const TABLE_STATUS = 'Status';
const TABLE_TIPO_MANUTENCAO = 'tipoManutencao';
const TABLE_PRIORIDADE = 'Prioridade';

export default class GetOrderMaintenanceSummaryValidate {

  async run(event: any) {
    try {
      const getQuery = this.getQuery()

      const result = await commitData.run(getQuery);
      console.log('cheguei até aqui');
      return result;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }


  getQuery() {
    const query = /*sql*/`
      SELECT
        os.idOrdemServico,
        os.resumo,
        os.descricao,
        os.dataEmissao,
        (SELECT t.tipoManutencao FROM ${TABLE_TIPO_MANUTENCAO} as t WHERE os.tipoManutencao_idtipoManutencao = t.idtipoManutencao) as tipo_manutencao,
        (SELECT p.descricaoPrioridade FROM ${TABLE_PRIORIDADE} as p WHERE os.Prioridade_idPrioridade = p.idPrioridade) as prioridade,
        (SELECT st.tipoStatus FROM ${TABLE_STATUS} as st WHERE os.Status_idStatus = st.idStatus) as status,
        (SELECT user.numeroCracha FROM ${TABLE_USUARIO} as user WHERE OrderHasUser.Usuario_idUsuario = user.idUsuario) as Manutentor
      FROM ${TABLE_ORDEM_SERVICO} as os
        LEFT JOIN ${TABLE_ORDEM_SERVICO_HAS_USUARIO} as OrderHasUser ON OrderHasUser.ordemServico_idOrdemServico = os.idOrdemServico
      WHERE os.excluded = 0
      GROUP BY os.idOrdemServico;
    `;

    const dataQuery = { query, type: 'Ordem de manutenção' };
    console.log(dataQuery);
    return dataQuery;
  }
}