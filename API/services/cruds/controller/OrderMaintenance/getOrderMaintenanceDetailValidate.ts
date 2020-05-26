import Get from '../../../../shared/dao/Get';

const commitData = new Get();

const TABLE_ORDEM_SERVICO = 'ordemServico';
const TABLE_LOCAIS = 'Locais';
const TABLE_STATUS = 'Status';
const TABLE_SETOR = 'Setor';
const TABLE_EQUIPAMENTOS = 'Equipamentos';
const TABLE_EQUIPAMENTO = 'Equipamento';
const TABLE_TIPO_MANUTENCAO = 'tipoManutencao';
const TABLE_PRIORIDADE = 'Prioridade';

export default class GetOrderMaintenanceDetailValidate {

  async run(event: any) {
    try {
      const params = this.getParams(event);

      const getQuery = this.getQuery(params)

      const result = await commitData.run(getQuery);
      console.log('cheguei até aqui');
      return result;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  getParams(event: any): number {
    const { idOrdemServico } = event.body.order || '';
    
    return idOrdemServico;
  }

  getQuery(params: number) {
    const post = [params]
    const query = /*sql*/`
      SELECT
        os.idOrdemServico,
        os.resumo,
        os.descricao,
        os.inicioPlanejado,
        os.fimPlanejado,
        os.requerParada,
        os.dataEmissao,
        (SELECT descricao FROM ${TABLE_EQUIPAMENTO} WHERE idEquipamento = Equipamentos.Equipamento) as equipamento,
        (SELECT Setor.nome FROM ${TABLE_SETOR} WHERE idSetor = Locais.Local) as local,
        (SELECT t.tipoManutencao FROM ${TABLE_TIPO_MANUTENCAO} as t WHERE os.tipoManutencao_idtipoManutencao = t.idtipoManutencao) as tipo_manutencao,
        (SELECT p.descricaoPrioridade FROM ${TABLE_PRIORIDADE} as p WHERE os.Prioridade_idPrioridade = p.idPrioridade) as prioridade,
        (SELECT st.tipoStatus FROM ${TABLE_STATUS} as st WHERE os.Status_idStatus = st.idStatus) as status
      FROM ${TABLE_ORDEM_SERVICO} as os
      LEFT JOIN ${TABLE_LOCAIS} as Locais ON Locais.Ordem_Servico = os.idOrdemServico
      LEFT JOIN ${TABLE_EQUIPAMENTOS} as Equipamentos ON Equipamentos.Ordem_servico = os.idOrdemServico
      WHERE os.excluded = 0 AND os.idOrdemServico = ?
      GROUP BY os.idOrdemServico;
    `;

    const dataQuery = { query, post, type: 'Ordem de manutenção' };
    console.log(dataQuery);
    return dataQuery;
  }
}