/* eslint-disable max-len */

const GenericDao = require('../GenericDao');

const { TABLE_APONTAMENTO } = require('../../../shared/constants/database');

module.exports = class AppointmentsDao extends GenericDao {
  constructor({
    user,
    order,
    date,
    time,
    description,
    mysql,
  } = {}) {
    super();

    this._user = user;
    this._order = order;
    this._date = date;
    this._time = time;
    this._description = description;
    this._mysql = mysql;
  }

  /**
   * registerAppointment
   * Registra uma Apontamentos
   * @return {Array} parsed array com o resultado da inserção
   */
  async registerAppointment() {
    const values = {
      data: this._date,
      descricao_atividade: this._description,
      tempo: this._time,
      ordemServico_idOrdemServico: this._order,
      Usuario_idUsuario: this._user,
    };

    const [rows] = await this._mysql.query(/* SQL */ `
      INSERT INTO ${TABLE_APONTAMENTO} SET ?;
    `, [values]);

    return this.parseInsertResponse(rows);
  }

  async validateUserAppointment() {
    const [rows] = await this._mysql.query(/* SQL */ `
      SELECT * FROM ordemServico_has_Usuario WHERE 
        ordemServico_idOrdemServico = ? AND
        Usuario_idUsuario = ?;
    `, [this._order, this._user]);

    return this.parseSelectResponse(rows);
  }
};
