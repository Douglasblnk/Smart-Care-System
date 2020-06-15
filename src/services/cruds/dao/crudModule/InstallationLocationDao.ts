import GenericDao from '../GenericDao';
import { TABLE_SETOR } from '../../../../shared/constants/database';
import { Connection } from 'mysql2/promise';

export default class InstallationLocationDao extends GenericDao {
  _mysql: Connection;
  _sector?: string;
  _updateId?: string;
  constructor({
    mysql,
    sector,
    updateId,
  }: { mysql: Connection, sector?: string, updateId?: string }) {
    super();

    this._mysql = mysql;
    this._sector = sector;
    this._updateId = updateId;
  }

  /**
   * getSector
   * Busca todos os Locais de instalação das ordens de manutenções
   * @return {Array} parsed array com todos os Locais de Instalação
   */
  async getSector() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT 
        * 
      FROM ${TABLE_SETOR}
      WHERE ${TABLE_SETOR}.excluded = ?;
    `, [0]);

    return this.parseSelectResponse(rows);
  }

  /**
   * registerSector
   * Registra um setor no sistema
   * @return {Array} parsed array com dados da inserção
   */
  async registerSector() {
    const values = {
      nome: this._sector,
    };
    const [rows] = await this._mysql.query(/* SQL */`
      INSERT INTO ${TABLE_SETOR} SET ?;
    `, [values]);

    return this.parseInsertResponse(rows);
  }

  /**
   * updateSector
   * Altera um setor no sistema
   * @return {Array} parsed array com dados da alteração
   */
  async updateSector() {
    const values = {
      nome: this._sector,
    };
    const [rows] = await this._mysql.query(/* SQL */`
    UPDATE ${TABLE_SETOR} SET ? WHERE idSetor = ?;
    `, [values, this._updateId]);

    return this.parseInsertResponse(rows);
  }

  /**
   * deleteSector
   * remove um setor do sistema
   * @return {Array} parsed array com as informações de deleção
   */
  async deleteSector() {
    const values = {
      excluded: 1,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_SETOR} SET ?
      WHERE ${TABLE_SETOR}.idSetor = ?;
    `, [values, this._updateId]);

    return this.parseInsertResponse(rows);
  }
}
