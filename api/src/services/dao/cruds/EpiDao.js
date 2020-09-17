const GenericDao = require('../GenericDao');
const { TABLE_EPI, TABLE_ORDEM_SERVICO_HAS_EPI } = require('../../../shared/constants/database');

module.exports = class EpiDao extends GenericDao {
  constructor({
    epiDescription,
    orderId = '',
    updateId,
    mysql,
  } = {}) {
    super();

    this._epiDescription = epiDescription;
    this._orderId = orderId;
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
   * getOrderEpis
   * Busca todos os EPIs de uma ordem de manutenção
   * @return {Array} parsed array com todos os EPIs de uma ordem
   */
  async getOrderEpis() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT
        ${TABLE_ORDEM_SERVICO_HAS_EPI}.ordemServico_idOrdemServico,
        ${TABLE_ORDEM_SERVICO_HAS_EPI}.Epi_idEpi,
        ${TABLE_EPI}.idEpi,
        ${TABLE_EPI}.descricaoEpi
      FROM Epi
      INNER JOIN ${TABLE_ORDEM_SERVICO_HAS_EPI} ON ${TABLE_ORDEM_SERVICO_HAS_EPI}.Epi_idEpi = ${TABLE_EPI}.idEpi
      WHERE ${TABLE_ORDEM_SERVICO_HAS_EPI}.ordemServico_idOrdemServico = ${this._orderId}
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
