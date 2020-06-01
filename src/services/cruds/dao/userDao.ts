import GenericDao from './GenericDao';

// eslint-disable-next-line no-unused-vars
import { Connection } from 'mysql2/promise';
import { TABLE_USUARIO } from '../../../shared/constants/database';

export default class UserDao extends GenericDao {
  _numeroCracha: string;
  _senha: string;
  _mysql: Connection;
  
  constructor({
    numeroCracha,
    senha,
    mysql,
  }: { numeroCracha: string, senha: string, mysql: Connection }) {
    super();

    this._numeroCracha = numeroCracha;
    this._senha = senha;
    this._mysql = mysql;
  }

  async makeLogin() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT
        *
      FROM ${TABLE_USUARIO}
      WHERE ${TABLE_USUARIO}.numeroCracha = ?
        AND ${TABLE_USUARIO}.excluded = ?
      `, [this._numeroCracha, 0],
    );

    return this.parseResponse(rows);
  }
}
