/* eslint-disable max-len */

const GenericDao = require('../../GenericDao');

const {
  TABLE_USUARIO,
  TABLE_ORDEM_SERVICO_HAS_USUARIO,
} = require('../../../../shared/constants/database');

module.exports = class VerificationDao extends GenericDao {
  constructor({
    cracha,
    order,
    mysql,
  } = {}) {
    super();

    this._cracha = cracha;
    this._order = order;
    this._mysql = mysql;
  }

  /**
   * validateVerification
   * Valida usuário Manutentor de uma verificação
   * @return {Array} parsed array com o resultado da consulta
   */
  async validateVerification() {
    const values = {
      numeroCracha: parseInt(this._cracha),
      ordemServico_idOrdemServico: this._order,
    };

    const stringValue = `SELECT user_verification.numeroCracha,
    ${TABLE_USUARIO}.idUsuario,
    ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.is_master,
    ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.Usuario_idUsuario,
    ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.ordemServico_idOrdemServico
    FROM ${TABLE_USUARIO} AS user_verification
    INNER JOIN ${TABLE_ORDEM_SERVICO_HAS_USUARIO} AS users_order
    ON ${TABLE_USUARIO}.idUsuario = ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.Usuario_idUsuario
    WHERE ${TABLE_USUARIO}.numeroCracha = ? AND
    ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.ordemServico_idOrdemServico = ? AND
    ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.is_master = 1;`;

    console.log('stringValue: ', stringValue);
    console.log('Values validateVerification: ', values);

    const rows = await this._mysql.query(/* SQL */stringValue, [values]);
    console.log('rows: ', rows);
    
    return this.parseInsertResponse(rows);
  }
};
