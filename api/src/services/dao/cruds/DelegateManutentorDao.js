const GenericDao = require('../GenericDao');
const { TABLE_ORDEM_SERVICO_HAS_USUARIO } = require('../../../shared/constants/database');

module.exports = class DelegateManutentorDao extends GenericDao {
  constructor({
    mysql,
    idOrdemServico,
    idUsuario,
    excluded,
    updateId,
  } = {}) {
    super();

    this._mysql = mysql;
    this._idOrdemServico = idOrdemServico;
    this._idUsuario = idUsuario;
    this._excluded = excluded;
    this._updateId = updateId;
  }


  /**
   * registerDelegateManutentor
   * Delegar manutentor na ordem serviço no sistema
   * @return {Array}; parsed array com dados da inserção
   */
  async registerDelegateManutentor() {
    const values = {
      idOrdemServico: this._idOrdemServico,
      idUsuario: this._idUsuario,
      excluded: this._excluded,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      INSERT INTO ${TABLE_ORDEM_SERVICO_HAS_USUARIO} SET ?;
    `, [values]);

    return this.parseInsertResponse(rows);
  }

  /**
   * updateDelegateManutentor
   * Altera um manutentor registrado em uma ordem no sistema
   * @return {Array} parsed array com dados da alteração
   */
  async updateDelegateManutentor() {
    const values = {
      idOrdemServico: this._idOrdemServico,
      idUsuario: this._idUsuario,
      excluded: this._excluded,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_ORDEM_SERVICO_HAS_USUARIO} SET ? WHERE idOrdemServico = ?;
    `, [values, this._updateId]);

    return this.parseInsertResponse(rows);
  }
};
