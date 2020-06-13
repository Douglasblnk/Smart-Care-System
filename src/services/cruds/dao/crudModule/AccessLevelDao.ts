import GenericDao from '../GenericDao';
import { TABLE_NIVEL_ACESSO } from '../../../../shared/constants/database';
import { Connection } from 'mysql2/promise';

export default class AccessLevelDao extends GenericDao {
  _mysql: Connection;
  
  constructor({
    mysql,
  }: { mysql: Connection }) {
    super();

    this._mysql = mysql;
  }

  /**
   * getAccessLevel
   * Busca todos os niveis de acesso no sistema
   * @return {Array} parsed array com todos os niveis de acesso
   */
  async getAccessLevel() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT
        *
      FROM ${TABLE_NIVEL_ACESSO}
    `);

    return this.parseSelectResponse(rows);
  }
}
