const GenericDao = require('./GenericDao');
const { TABLE_SINTOMAS } = require('../../../shared/constants/database');

module.exports = class SymptomDao extends GenericDao {
  constructor({
    symptomDescription,
    updateId,
    mysql,
  } = {}) {
    super();

    this._symptomDescription = symptomDescription;
    this._updateId = updateId;
    this._mysql = mysql;
  }

  /**
   * getSymptom
   * Busca todos os sintomas no sistema
   * @return {Array} parsed array com todos os sintomas
   */
  async getSymptom() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT
        *
      FROM ${TABLE_SINTOMAS}
        WHERE ${TABLE_SINTOMAS}.excluded = ?
    `, [0]);

    return this.parseSelectResponse(rows);
  }

  /**
   * registerSymptom
   * Cadastra um sintoma no sistema
   * @return {Array} parsed array com as informações de inserção
   */
  async registerSymptom() {
    const values = {
      descricaoSintomas: this._symptomDescription,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      INSERT INTO ${TABLE_SINTOMAS} SET ?
    `, [values]);

    return this.parseInsertResponse(rows);
  }

  /**
   * updateSymptom
   * Atualiza um sintoma no sistema
   * @return {Array} parsed array com as informações de inserção
   */
  async updateSymptom() {
    const values = {
      descricaoSintomas: this._symptomDescription,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_SINTOMAS} SET ?
        WHERE idSintomas = ?;
    `, [values, this._updateId]);

    return this.parseInsertResponse(rows);
  }

  /**
   * deleteSymptom
   * remove um sintoma do sistema
   * @return {Array} parsed array com as informações de deleção
   */
  async deleteSymptom() {
    const values = {
      excluded: 1,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_SINTOMAS} SET ?
        WHERE idSintomas = ?;
    `, [values, this._updateId]);

    return this.parseInsertResponse(rows);
  }
};
