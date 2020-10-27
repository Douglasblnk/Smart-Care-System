const GenericDao = require('../GenericDao');
const { TABLE_PRIORIDADE } = require('../../../shared/constants/database');

module.exports = class PriorityDao extends GenericDao {
  constructor({ mysql } = {}) {
    super();

    this._mysql = mysql;
  }

  /**
   * getPriority
   * Busca todos as prioridades
   * @return {Array} parsed array com todos as prioridades
   */
//   async getPriority() {
//     const [rows] = await this._mysql.query(/* SQL */`
//       SELECT 
//         * 
//       FROM ${TABLE_PRIORIDADE}
//       WHERE ${TABLE_PRIORIDADE}.excluded = ?;
//     `, [0]);

//     return this.parseSelectResponse(rows);
//   }
};
