const GenericDao = require('../GenericDao');

const { TABLE_ORDEM_SERVICO_HAS_USUARIO } = require('../../../shared/constants/database');

module.exports = class DelegateMaintainer extends GenericDao {
  constructor({
    orderId,
    newMaintainerId,
    mysql,
  } = {}) {
    super();

    this._orderId = orderId;
    this._newMaintainerId = newMaintainerId;
    this._mysql = mysql;
  }

  /**
   * delegateMaintainer
   * Delega uma ordem a um manutentor
   * @return {Array} parsed array com o resultado da inserção
   */
  async delegateMaintainer() {
    const values = {
      Usuario_idUsuario: this._newMaintainerId,
      is_master: 1,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_ORDEM_SERVICO_HAS_USUARIO}
        SET ?
      WHERE ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.ordemServico_idOrdemServico = ?
    `, [values, this._orderId]);

    return this.parseInsertResponse(rows);
  }
};
