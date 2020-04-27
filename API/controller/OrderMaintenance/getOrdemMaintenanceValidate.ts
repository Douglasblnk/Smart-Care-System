import Get from '../../shared/dao/Get';

const commitData = new Get();

const TABLE = 'ordemServico';

export default class GetOrderMaintenanceValidate {

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
        os.inicioPlanejado,
        os.fimPlanejado,
        os.requerParada,
        os.dataEmissao,
        (SELECT e.descricao from Equipamento as e WHERE os.Equipamento_idEquipamento = e.idEquipamento) as equipamento,
        os.dadosOperacoes_iddadoOperacao as dados_operacao,
        (SELECT t.tipoManutencao from tipoManutencao as t WHERE os.tipoManutencao_idtipoManutencao = t.idtipoManutencao) as tipo_manutencao,
        (SELECT s.nome from Setor as s WHERE os.Setor_idSetor = s.idSetor) as setor,
        (SELECT p.descricaoPrioridade from Prioridade as p WHERE os.Prioridade_idPrioridade = p.idPrioridade) as prioridade,
        (SELECT st.tipoStatus from Status as st WHERE os.Status_idStatus = st.idStatus) as status
      from ${TABLE} as os;
    
    `;

    const dataQuery = { query, type: 'Ordem de manutenção' };
    console.log(dataQuery);
    return dataQuery;
  }
}