const GenericDao = require('../GenericDao');
const { TABLE_NIVEL_ACESSO } = require('../../../../shared/constants/database');

module.exports = class AccessLevelDao extends GenericDao {
  constructor({
    mysql,
  } = {}) {
    super();

    this._mysql = mysql;
  }

  /**
   * getAccessLevel
   * Busca todos os niveis de acesso no sistema
   * @return {Array} parsed array com todos os niveis de acesso
   */
  async getAccessLevel() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT
        *
      FROM ${TABLE_NIVEL_ACESSO}
    `);

    return this.parseSelectResponse(rows);
  }
};
