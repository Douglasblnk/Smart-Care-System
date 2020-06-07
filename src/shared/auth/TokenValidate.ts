import { Connection } from 'mysql2/promise';
import { TABLE_USUARIO } from '../constants/database';
import { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } from '../constants/HTTPResponse';

export default class TokenValidate {
  _numeroCracha: string;
  _mysql: Connection;

  constructor({
    numeroCracha,
  }: { numeroCracha: string }, mysql: Connection) {
    this._numeroCracha = numeroCracha;
    this._mysql = mysql;

    this.checkParameters();
  }

  async run() {
    try {
      const [rows] = await this._mysql.query(/* SQL */`
        SELECT
          *
        FROM ${TABLE_USUARIO}
        WHERE ${TABLE_USUARIO}.numeroCracha = ?
      `, [this._numeroCracha]);
      
      const user = JSON.parse(JSON.stringify(rows));

      if (!user || user.length === 0)
        throw { status: STATUS_UNAUTHORIZED, msg: MESSAGE_UNAUTHORIZED };

      return rows;
    } catch (err) {
      console.log('err registerUser :>> ', err);

      throw err;
    }
  }

  private checkParameters = () => {
    if (!this._numeroCracha) throw new Error('Crachá não encontrado');
    if (!this._mysql) throw new Error('Conexão não estabelicida');
  }
}
