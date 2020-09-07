const GenericDao = require('./GenericDao');
const { TABLE_OPERACAO } = require('../../../shared/constants/database');

module.exports = class OperationsDao extends GenericDao {
  constructor({
    operationDescription,
    material,
    materialQuantity,
    materialUnit,
    plannedTime,
    updateId,
    mysql,
  } = {}) {
    super();
    this._operationDescription = operationDescription;
    this._material = material;
    this._materialQuantity = materialQuantity;
    this._materialUnit = materialUnit;
    this._plannedTime = plannedTime;
    this._updateId = updateId;

    this._mysql = mysql;
  }

  /**
   * getOperation
   * Busca todas as operações
   * @return {Array} parsed array com todos as operações
   */
  async getOperations() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT 
        * 
      FROM ${TABLE_OPERACAO}
      WHERE ${TABLE_OPERACAO}.excluded = ?;
    `, [0]);

    return this.parseSelectResponse(rows);
  }

  /**
   * updateOperation
   * Atualiza uma operação
   * @return {Array} parsed array com o resultado da inserção
   */
  async updateOperation() {
    const values = {
      descricao_operacao: this._operationDescription,
      material: this._material,
      quantidade_material: this._materialQuantity,
      unidade_material: this._materialUnit,
      tempo_planejado: this._plannedTime,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_OPERACAO} SET ? WHERE idoperacao = ?;
    `, [values, this._updateId]);

    return this.parseInsertResponse(rows);
  }

  /**
   * registerOperation
   * Registra uma operação
   * @return {Array} parsed array com o resultado da inserção
   */
  async registerOperation() {
    const values = {
      descricao_operacao: this._operationDescription,
      material: this._material,
      quantidade_material: this._materialQuantity,
      unidade_material: this._materialUnit,
      tempo_planejado: this._plannedTime,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      INSERT INTO ${TABLE_OPERACAO} SET ?;
    `, [values]);

    return this.parseInsertResponse(rows);
  }

  /**
   * deleteOperation
   * Deleta uma operação
   * @return {Array} parsed array com o resultado da inserção
   */
  async deleteOperation() {
    const values = {
      excluded: 1,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_OPERACAO} SET ?
      WHERE ${TABLE_OPERACAO}.idoperacao = ?;
    `, [values, this._updateId]);

    return this.parseInsertResponse(rows);
  }
};
