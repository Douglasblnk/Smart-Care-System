import GenericDao from './GenericDao';
import { TABLE_STATUS } from '../../../shared/constants/database';
import { Connection } from 'mysql2/promise';

export default class StatusDao extends GenericDao {
  _mysql: Connection;
  
  constructor({
    mysql,
  }: { mysql: Connection }) {
    super();

    this._mysql = mysql;
  }

  /**
   * getStatus
   * Busca todos os status das ordens de manutenções
   * @return {Array} parsed array com todos os Status das ordens
   */
  async getStatus() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT
        *
      FROM ${TABLE_STATUS}
        WHERE ${TABLE_STATUS}.excluded = ?
    `, [0]);

    return this.parseSelectResponse(rows);
  }
}
