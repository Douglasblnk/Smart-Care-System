import GenericDao from './GenericDao';
import { TABLE_SINTOMAS } from '../../../../shared/constants/database';
import { Connection } from 'mysql2/promise';

export default class SymptomDao extends GenericDao {
  _symptomDescription?: string;
  _updateId?: number;
  _mysql: Connection;
  
  constructor({
    symptomDescription,
    updateId,
    mysql,
  }: { symptomDescription?: string, updateId?: number, mysql: Connection }) {
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
}
