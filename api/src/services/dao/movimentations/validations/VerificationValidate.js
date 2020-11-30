/* eslint-disable max-len */

const GenericDao = require('../../GenericDao');

const {
  TABLE_USUARIO,
  TABLE_ORDEM_SERVICO_HAS_USUARIO,
  TABLE_VERIFICACAO,
} = require('../../../../shared/constants/database');

module.exports = class VerificationDao extends GenericDao {
  constructor({
    cracha,
    order,
    typeVerification,
    mysql,
  } = {}) {
    super();

    this._cracha = cracha;
    this._order = order;
    this._typeVerification = typeVerification;
    this._mysql = mysql;
  }

  /**
   * validateVerification
   * Valida usuário Manutentor de uma verificação
   * @return {Array} parsed array com o resultado da consulta
   */
  async validateVerification() {
    const [rows] = await this._mysql.query(`SELECT ${TABLE_USUARIO}.numeroCracha,
      ${TABLE_USUARIO}.idUsuario,
      ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.is_master,
      ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.Usuario_idUsuario,
      ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.ordemServico_idOrdemServico
      FROM ${TABLE_USUARIO}
      INNER JOIN ${TABLE_ORDEM_SERVICO_HAS_USUARIO}
      ON ${TABLE_USUARIO}.idUsuario = ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.Usuario_idUsuario
      WHERE ${TABLE_USUARIO}.numeroCracha = ? AND 
      ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.ordemServico_idOrdemServico = ? AND 
      ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.is_master = ?;`,
    [this._cracha, this._order, 1]);

    return this.parseSelectResponse(rows);
  }

  async validateRegisterExist() {
    const [rows] = await this._mysql.query(`
      SELECT * FROM ${TABLE_VERIFICACAO} 
      WHERE Verificacao.ordemServico_idOrdemServico = ? AND
      Verificacao.tipoVerificacao = ?;`,
    [this._order, this._typeVerification]);

    return this.parseSelectResponse(rows);
  }

  async validateCheckPreviousSequence(typeVerification) {
    const [rows] = await this._mysql.query(`
      SELECT * FROM ${TABLE_VERIFICACAO} 
      WHERE Verificacao.ordemServico_idOrdemServico = ? AND
      Verificacao.tipoVerificacao = ?;`,
    [this._order, typeVerification]);

    return this.parseSelectResponse(rows);
  }
};
