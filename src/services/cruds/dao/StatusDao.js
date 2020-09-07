const GenericDao = require('./GenericDao');
const { TABLE_STATUS } = require('../../../shared/constants/database');

module.exports = class StatusDao extends GenericDao {
  constructor({
    mysql,
  } = {}) {
    super();

    this._mysql = mysql;
  }

  /**
   * getStatus
   * Busca todos os status das ordens de manutenções
   * @return {Array} parsed array com todos os Status das ordens
   */
  async getStatus() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT
        *
      FROM ${TABLE_STATUS}
        WHERE ${TABLE_STATUS}.excluded = ?
    `, [0]);

    return this.parseSelectResponse(rows);
  }
};
