const GenericDao = require('./GenericDao');
const { TABLE_TIPO_MANUTENCAO } = require('../../../shared/constants/database');

module.exports = class OrderTypeDao extends GenericDao {
  constructor({ mysql } = {}) {
    super();

    this._mysql = mysql;
  }

  /**
   * getOrderType
   * Busca todos os tipos de ordem
   * @return {Array} parsed array com todos os tipos de ordem
   */
  async getOrderType() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT 
        * 
      FROM ${TABLE_TIPO_MANUTENCAO}
      WHERE ${TABLE_TIPO_MANUTENCAO}.excluded = ?;
    `, [0]);

    return this.parseSelectResponse(rows);
  }
};
