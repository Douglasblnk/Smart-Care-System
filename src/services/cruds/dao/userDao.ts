import GenericDao from './GenericDao';

// eslint-disable-next-line no-unused-vars
import { Connection } from 'mysql2/promise';
import { TABLE_USUARIO } from '../../../shared/constants/database';

export default class UserDao extends GenericDao {
  _numeroCracha: string;
  _senha: string;
  _nome: string;
  _funcao: string;
  _email: string;
  _nivelAcesso: string;
  _mysql: Connection;
  
  constructor({
    numeroCracha = '',
    senha = '',
    nome = '',
    funcao = '',
    email = '',
    nivelAcesso = '',
    mysql,
  }: {
    numeroCracha?: string,
    senha?: string,
    nome?: string,
    funcao?: string,
    email?: string,
    nivelAcesso?: string,
    mysql: Connection,
  }) {
    super();

    this._numeroCracha = numeroCracha;
    this._senha = senha;
    this._nome = nome;
    this._funcao = funcao;
    this._email = email;
    this._nivelAcesso = nivelAcesso;
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

  async getUsers() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT
        *
      FROM ${TABLE_USUARIO}
        WHERE ${TABLE_USUARIO}.excluded = ?
    `, [0]);

    return this.parseResponse(rows);
  }

  async registerUser() {
    const values = {
      numeroCracha: this._numeroCracha,
      senha: this._senha,
      nome: this._nome,
      funcao: this._funcao,
      email: this._email,
      nivel_acesso: this._nivelAcesso,
    };

    const [rows] = await this._mysql.query(/* SQL */ `
      INSERT INTO ${TABLE_USUARIO} SET ?
      `, [values],
    );

    return this.parseInsertResponse(rows);
  }
}
