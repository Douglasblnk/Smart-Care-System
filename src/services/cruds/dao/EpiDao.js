const GenericDao = require('./GenericDao');
const { TABLE_EPI } = require('../../../shared/constants/database');

module.exports = class EpiDao extends GenericDao {
  constructor({
    epiDescription,
    updateId,
    mysql,
  } = {}) {
    super();

    this._epiDescription = epiDescription;
    this._updateId = updateId;
    this._mysql = mysql;
  }

  /**
   * getEpis
   * Busca todos os EPIs
   * @return {Array} parsed array com todos os EPIs
   */
  async getEpis() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT 
        * 
      FROM ${TABLE_EPI}
      WHERE ${TABLE_EPI}.excluded = ?;
    `, [0]);

    return this.parseSelectResponse(rows);
  }

  /**
   * updateEpi
   * Atualiza um EPI
   * @return {Array} parsed array com o resultado da inserção
   */
  async updateEpi() {
    const values = {
      descricaoEpi: this._epiDescription,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_EPI} SET ? WHERE idEpi = ?;
    `, [values, this._updateId]);

    return this.parseInsertResponse(rows);
  }

  /**
   * registerEpi
   * Registra um EPI
   * @return {Array} parsed array com o resultado da inserção
   */
  async registerEpi() {
    const values = {
      descricaoEpi: this._epiDescription,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      INSERT INTO ${TABLE_EPI} SET ?;
    `, [values]);

    return this.parseInsertResponse(rows);
  }

  /**
   * deleteEpi
   * Deleta um EPI
   * @return {Array} parsed array com o resultado da inserção
   */
  async deleteEpi() {
    const values = {
      excluded: 1,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_EPI} SET ?
      WHERE ${TABLE_EPI}.idEpi = ?;
    `, [values, this._updateId]);

    return this.parseInsertResponse(rows);
  }
};
