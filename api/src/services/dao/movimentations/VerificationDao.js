/* eslint-disable max-len */

const GenericDao = require('../GenericDao');

const {
  TABLE_VERIFICACAO,
} = require('../../../shared/constants/database');

module.exports = class VerificationDao extends GenericDao {
  constructor({
    solutionDescription,
    resolved,
    dateVerification,
    order,
    typeVerification,
    mysql,
  } = {}) {
    super();

    this._solutionDescription = solutionDescription;
    this._resolved = resolved;
    this._dateVerification = dateVerification;
    this._order = order;
    this._typeVerification = typeVerification;
    this._mysql = mysql;
  }

  /**
   * registerVerification
   * Registra uma verificação
   * @return {Array} parsed array com o resultado da inserção
   */
  async registerVerification() {
    const values = {
      solucaoRealizada: this._solutionDescription,
      problemaResolvido: this._resolved,
      dataVerificacao: this._dateVerification,
      ordemServico_idOrdemServico: this._order,
      tipoVerificacao: this._typeVerification,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      INSERT INTO ${TABLE_VERIFICACAO} SET ?;
    `, [values]);

    return this.parseInsertResponse(rows);
  }
};
