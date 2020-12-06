
const GenericDao = require('../../GenericDao');

const {
  TABLE_ORDEM_SERVICO_HAS_USUARIO,
  TABLE_ORDEM_SERVICO,
} = require('../../../../shared/constants/database');

module.exports = class CorrectiveMaintenanceOrder extends GenericDao {
  constructor({
    userId,
    orderId,
    mysql,
  }) {
    super();
    this._isMaster = true;
    
    this._userId = userId;
    this._orderId = orderId;
    this._mysql = mysql;
  }

  async assumeOrder() {
    try {
      await this._mysql.beginTransaction();

      await this.insertUserIntoOrder();
      await this.changeOrderStatus();
      
      await this._mysql.commit();

      return { result: 'Ordem Assumida!' };
    } catch (err) {
      console.log('err assumeOrder => :>> ', err);

      await this._mysql.rollback();
      throw err;
    }
  }

  async insertUserIntoOrder() {
    const values = {
      ordemServico_idOrdemServico: this._orderId,
      Usuario_idUsuario: this._userId,
      excluded: 0,
      is_master: this._isMaster,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      INSERT INTO ${TABLE_ORDEM_SERVICO_HAS_USUARIO} SET ?
    `, [values]);

    return this.parseInsertResponse(rows);
  }

  async changeOrderStatus() {
    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_ORDEM_SERVICO}
        SET Status_idStatus = ?
      WHERE idOrdemServico = ?;
    `, [5, this._orderId]);

    return this.parseInsertResponse(rows);
  }
};
