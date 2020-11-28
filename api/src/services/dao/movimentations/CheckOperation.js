const GenericDao = require('../GenericDao');

const {
  TABLE_EQUIPAMENTO_OPERACAO,
} = require('../../../shared/constants/database');

module.exports = class CheckOperation extends GenericDao {
  constructor({
    operation,
    equipmentId,
    checked,
    mysql,
  } = {}) {
    super();

    this._operation = operation;
    this._equipmentId = equipmentId;
    this._checked = checked;
    this._mysql = mysql;
  }

  /**
   * checkOperation
   * Marca uma operação como executada
   * @return {Array} parsed array com o resultado da inserção
   */
  async checkOperation() {
    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_EQUIPAMENTO_OPERACAO}
        SET ${TABLE_EQUIPAMENTO_OPERACAO}.execucao = ?
      WHERE ${TABLE_EQUIPAMENTO_OPERACAO}.Operacao_FK = ?
        AND ${TABLE_EQUIPAMENTO_OPERACAO}.Equipamento_FK = ?;
    `, [this._checked, this._operation, this._equipmentId]);

    return this.parseInsertResponse(rows);
  }

  /**
   * getOperation
   * Busca a operação
   * @return {Array} parsed array com o resultado da busca
   */
  async getOperation() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT
        *
      FROM ${TABLE_EQUIPAMENTO_OPERACAO}
      WHERE ${TABLE_EQUIPAMENTO_OPERACAO}.Operacao_FK = ?
        AND ${TABLE_EQUIPAMENTO_OPERACAO}.Equipamento_FK = ?;
    `, [this._operation, this._equipmentId]);

    return this.parseSelectResponse(rows);
  }
};
