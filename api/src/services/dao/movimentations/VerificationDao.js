/* eslint-disable max-len */

const GenericDao = require('../GenericDao');

module.exports = class VerificationDao extends GenericDao {
  constructor({
    mysql,
  } = {}) {
    super();

    this._mysql = mysql;
  }

  // /**
  //  * registerVerification
  //  * Registra uma verificação
  //  * @return {Array} parsed array com o resultado da inserção
  //  */
  // async registerVerification() {
  //   const values = {
  //     descricaoEpi: this._epiDescription,
  //   };

  //   const [rows] = await this._mysql.query(/* SQL */`
  //     INSERT INTO ${TABLE_EPI} SET ?;
  //   `, [values]);

  //   return this.parseInsertResponse(rows);
  // }
};
