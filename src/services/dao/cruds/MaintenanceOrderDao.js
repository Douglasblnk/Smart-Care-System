const GenericDao = require('../GenericDao');

const {
  TABLE_ORDEM_SERVICO,
  TABLE_TIPO_MANUTENCAO,
  TABLE_PRIORIDADE,
  TABLE_STATUS,
  TABLE_LOCAIS,
  TABLE_EQUIPAMENTOS,
  TABLE_EQUIPAMENTO,
  TABLE_SETOR,
} = require('../../../shared/constants/database');

module.exports = class MaintenanceOrderDao extends GenericDao {
  constructor({
    order = '',
    mysql,
  } = {}) {
    super();

    this._order = order;
    this._mysql = mysql;
  }

  /**
   * getSummaryOrders
   * Busca todos as ordens sumarizadas no sistema
   * @return {Array} parsed array com todos as ordens de manutenção resumidas
   */
  async getSummaryOrders() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT
        os.idOrdemServico,
        os.resumo,
        os.descricao,
        os.dataEmissao,
        (SELECT st.tipoStatus FROM ${TABLE_STATUS} as st WHERE os.Status_idStatus = st.idStatus) as status,
        (
          SELECT
            t.tipoManutencao
            FROM ${TABLE_TIPO_MANUTENCAO} as t
            WHERE os.tipoManutencao_idtipoManutencao = t.idtipoManutencao
          ) as tipo_manutencao,
        (
          SELECT
            p.descricaoPrioridade
            FROM ${TABLE_PRIORIDADE} as p
            WHERE os.Prioridade_idPrioridade = p.idPrioridade
          ) as prioridade
      FROM ${TABLE_ORDEM_SERVICO} as os
      WHERE os.excluded = 0
      GROUP BY os.idOrdemServico;
    `);

    return this.parseSelectResponse(rows);
  }

  /**
   * getDetailOrders
   * Busca todos as ordens de manutenção no sistema
   * @return {Array} parsed array com todos as ordens de manutenção detalhadas
   */
  async getDetailOrders() {
    const [rows] = await this._mysql.query(/* SQL */`
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
        (SELECT st.tipoStatus FROM ${TABLE_STATUS} as st WHERE os.Status_idStatus = st.idStatus) as status,
        (
          SELECT
            t.tipoManutencao
          FROM ${TABLE_TIPO_MANUTENCAO} as t
          WHERE os.tipoManutencao_idtipoManutencao = t.idtipoManutencao
        ) as tipo_manutencao,
        (
          SELECT
            p.descricaoPrioridade
          FROM ${TABLE_PRIORIDADE} as p
          WHERE os.Prioridade_idPrioridade = p.idPrioridade
        ) as prioridade
      FROM ${TABLE_ORDEM_SERVICO} as os
      LEFT JOIN ${TABLE_LOCAIS} as Locais ON Locais.Ordem_Servico = os.idOrdemServico
      LEFT JOIN ${TABLE_EQUIPAMENTOS} as Equipamentos ON Equipamentos.Ordem_servico = os.idOrdemServico
      WHERE os.excluded = 0 AND os.idOrdemServico = ?
      GROUP BY os.idOrdemServico;
    `, [this._order]);

    return this.parseSelectResponse(rows);
  }
  /**
   * deleteOrder
   * Deleta uma ordem de manutenção do sistema
   * @return {Array} parsed array com os dados de deleção
   */
  async deleteOrder() {
    const values = {
      excluded: 1,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_ORDEM_SERVICO} SET ?
      WHERE ${TABLE_ORDEM_SERVICO}.idOrdemServico = ?;
    `, [values, this._order]);

    return this.parseInsertResponse(rows);
  }
};
