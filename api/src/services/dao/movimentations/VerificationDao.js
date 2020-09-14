/* eslint-disable max-len */

const GenericDao = require('../GenericDao');
const {
  TABLE_ORDEM_SERVICO,
  TABLE_VERIFICACAO,
  TABLE_USUARIO,
  TABLE_ORDEM_SERVICO_HAS_USUARIO,
} = require('../../../shared/constants/database');

module.exports = class VerificationDao extends GenericDao {
  constructor({
    mysql,
  } = {}) {
    super();

    this._mysql = mysql;
  }

  /**
   * getVerifications
   * Busca todas as verificações
   * @return {Array} parsed array com todas as verificações
   */
  async getVerifications() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT
        ${TABLE_VERIFICACAO}.tipoVerificacao,
        ${TABLE_VERIFICACAO}.ordemServico_idOrdemServico, 
        ${TABLE_VERIFICACAO}.dataVerificacao,
        ${TABLE_VERIFICACAO}.problemaResolvido, 
        ${TABLE_ORDEM_SERVICO}.Status_idStatus,
        ${TABLE_ORDEM_SERVICO}.tipoManutencao_idtipoManutencao, 
        ${TABLE_ORDEM_SERVICO}.reporte,
        ${TABLE_ORDEM_SERVICO}.solicitante,
        ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.Usuario_idUsuario,
        ${TABLE_ORDEM_SERVICO}.resumo,
        ${TABLE_ORDEM_SERVICO}.descricao,
        ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.is_master,
        user_report.nome AS name_report,
        user_requester.nome AS name_requester,
        user_maintainer.nome AS name_maintainer
      FROM ${TABLE_VERIFICACAO}
      INNER JOIN ${TABLE_ORDEM_SERVICO} ON ${TABLE_ORDEM_SERVICO}.idOrdemServico = ${TABLE_VERIFICACAO}.ordemServico_idOrdemServico 
      INNER JOIN ${TABLE_ORDEM_SERVICO_HAS_USUARIO} ON ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.ordemServico_idOrdemServico = ${TABLE_VERIFICACAO}.ordemServico_idOrdemServico
      INNER JOIN ${TABLE_USUARIO} AS user_report ON user_report.idUsuario = ${TABLE_ORDEM_SERVICO}.reporte
      INNER JOIN ${TABLE_USUARIO} AS user_requester ON user_requester.idUsuario = ${TABLE_ORDEM_SERVICO}.solicitante
      INNER JOIN ${TABLE_USUARIO} AS user_maintainer ON user_maintainer.idUsuario =  ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.Usuario_idUsuario 
      WHERE ${TABLE_ORDEM_SERVICO}.Status_idStatus = ? AND ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.is_master = ?;
    `, [6, 1]);

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
