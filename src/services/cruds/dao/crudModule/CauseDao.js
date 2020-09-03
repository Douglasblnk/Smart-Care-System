const GenericDao = require('../GenericDao');
const { TABLE_CAUSA } = require('../../../../shared/constants/database');

module.exports = class CauseDao extends GenericDao {
  constructor({
    causeDescription,
    updateId,
    mysql,
  } = {}) {
    super();

    this._causeDescription = causeDescription;
    this._updateId = updateId;
    this._mysql = mysql;
  }

  /**
   * getCauses
   * Busca todos as causas
   * @return {Array} parsed array com todos as causas
   */
  async getCauses() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT 
        * 
      FROM ${TABLE_CAUSA}
      WHERE ${TABLE_CAUSA}.excluded = ?;
    `, [0]);

    return this.parseSelectResponse(rows);
  }

  /**
   * updateCause
   * Atualiza uma causa
   * @return {Array} parsed array com o resultado da inserção
   */
  async updateCause() {
    const values = {
      descricaoCausa: this._causeDescription,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_CAUSA} SET ? WHERE idCausa = ?;
    `, [values, this._updateId]);

    return this.parseInsertResponse(rows);
  }

  /**
   * registerCause
   * Registra uma causa
   * @return {Array} parsed array com o resultado da inserção
   */
  async registerCause() {
    const values = {
      descricaoCausa: this._causeDescription,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      INSERT INTO ${TABLE_CAUSA} SET ?;
    `, [values]);

    return this.parseInsertResponse(rows);
  }

  /**
   * deleteCause
   * Deleta uma causa
   * @return {Array} parsed array com o resultado da inserção
   */
  async deleteCause() {
    const values = {
      excluded: 1,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_CAUSA} SET ?
      WHERE ${TABLE_CAUSA}.idCausa = ?;
    `, [values, this._updateId]);

    return this.parseInsertResponse(rows);
  }
};
