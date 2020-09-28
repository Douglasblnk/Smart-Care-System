/* eslint-disable max-len */
const GenericDao = require('../GenericDao');

const {
  TABLE_USUARIO,
  TABLE_ORDEM_SERVICO_HAS_USUARIO,
} = require('../../../shared/constants/database');

module.exports = class UsersInOrder extends GenericDao {
  constructor({
    orderId,
    mysql,
  } = {}) {
    super();

    this._mysql = mysql;
    this._orderId = orderId;
  }

  /**
   * getUsersInOrder
   * Busca todas os usuário que estão na ordem
   * @return {Array} parsed array com todas os usuários de uma ordem
   */
  async getUsersInOrder() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT
        ${TABLE_USUARIO}.idUsuario,
        ${TABLE_USUARIO}.nome,
        ${TABLE_USUARIO}.funcao,
        ${TABLE_USUARIO}.numeroCracha,
        order_has_user.is_master
      FROM ${TABLE_USUARIO}
      INNER JOIN ${TABLE_ORDEM_SERVICO_HAS_USUARIO} as order_has_user ON order_has_user.Usuario_idUsuario = ${TABLE_USUARIO}.idUsuario
      WHERE order_has_user.ordemServico_idOrdemServico = ? AND order_has_user.excluded = 0;
    `, [this._orderId]);

    return this.parseSelectResponse(rows);
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
