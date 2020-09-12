const GenericDao = require('../GenericDao');
const { TABLE_CENTRO_TRABALHO } = require('../../../shared/constants/database');

module.exports = class WorkCenterDao extends GenericDao {
  constructor({
    workCenterDescription,
    updateId,
    mysql,
  } = {}) {
    super();

    this._workCenterDescription = workCenterDescription;
    this._updateId = updateId;
    this._mysql = mysql;
  }

  /**
   * getWorkCenter
   * Busca todos os centros de trabalho
   * @return {Array} parsed array com todos os EPIs
   */
  async getWorkCenter() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT 
        * 
      FROM ${TABLE_CENTRO_TRABALHO}
      WHERE ${TABLE_CENTRO_TRABALHO}.excluded = ?;
    `, [0]);

    return this.parseSelectResponse(rows);
  }

  /**
   * updateWorkCenter
   * Atualiza um centro de trabalho
   * @return {Array} parsed array com o resultado da inserção
   */
  async updateWorkCenter() {
    const values = {
      descricao: this._workCenterDescription,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_CENTRO_TRABALHO} SET ? WHERE id_centro_trabalho = ?;
    `, [values, this._updateId]);

    return this.parseInsertResponse(rows);
  }

  /**
   * registerWorkCenter
   * Registra um centro de trabalho
   * @return {Array} parsed array com o resultado da inserção
   */
  async registerWorkCenter() {
    const values = {
      descricao: this._workCenterDescription,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      INSERT INTO ${TABLE_CENTRO_TRABALHO} SET ?;
    `, [values]);

    return this.parseInsertResponse(rows);
  }

  /**
   * deleteWorkCenter
   * Deleta um centro de trabalho
   * @return {Array} parsed array com o resultado da inserção
   */
  async deleteWorkCenter() {
    const values = {
      excluded: 1,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_CENTRO_TRABALHO} SET ?
      WHERE ${TABLE_CENTRO_TRABALHO}.id_centro_trabalho = ?;
    `, [values, this._updateId]);

    return this.parseInsertResponse(rows);
  }
};
