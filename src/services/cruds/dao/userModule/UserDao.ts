import GenericDao from '../selfCrudModule/GenericDao';

// eslint-disable-next-line no-unused-vars
import { Connection } from 'mysql2/promise';
import { TABLE_USUARIO } from '../../../../shared/constants/database';
import { userDao } from '../../../../shared/types';

export default class UserDao extends GenericDao {
  _numeroCracha?: string;
  _senha?: string;
  _nome?: string;
  _funcao?: string;
  _email?: string;
  _nivelAcesso?: string;
  _updateId?: string;
  _mysql: Connection;
  
  constructor({
    numeroCracha,
    senha,
    nome,
    funcao,
    email,
    nivelAcesso,
    updateId,
    mysql,
  }: userDao) {
    super();

    this._numeroCracha = numeroCracha;
    this._senha = senha;
    this._nome = nome;
    this._funcao = funcao;
    this._email = email;
    this._nivelAcesso = nivelAcesso;
    this._updateId = updateId;
    this._mysql = mysql;
  }

  /**
   * makeLogin
   * Busca no banco o usuário que atender as condições impostas
   * @returns {Object} parsed object contendo o usuário
   */
  async makeLogin() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT
        *
      FROM ${TABLE_USUARIO}
      WHERE ${TABLE_USUARIO}.numeroCracha = ?
        AND ${TABLE_USUARIO}.excluded = ?
      `, [this._numeroCracha, 0],
    );

    return this.parseSelectResponse(rows);
  }

  /**
   * getUsers
   * Busca todos os usuários ativos no sistema
   * @return {Array} parsed array com todos os usuários no sistema
   */
  async getUsers() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT
        *
      FROM ${TABLE_USUARIO}
        WHERE ${TABLE_USUARIO}.excluded = ?
    `, [0]);

    return this.parseSelectResponse(rows);
  }

  /**
   * getReporterUser
   * Busca todos os usuários de nível solicitante
   * @return {Array} parsed array com todos os usuários de nível solicitante
   */
  async getReporterUser() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT
        ${TABLE_USUARIO}.idUsuario,
        ${TABLE_USUARIO}.numeroCracha,
        ${TABLE_USUARIO}.nome,
        ${TABLE_USUARIO}.nivel_acesso
      FROM ${TABLE_USUARIO}
      WHERE
        ${TABLE_USUARIO}.nivel_acesso = ?
        AND ${TABLE_USUARIO}.excluded = ?
    `, [1, 0]);

    return this.parseSelectResponse(rows);
  }

  /**
   * getRequesterUser
   * Busca todos os usuários de nível administrador
   * @return {Array} parsed array com todos os usuários de nível administrador
   */
  async getRequesterUser() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT
        ${TABLE_USUARIO}.idUsuario,
        ${TABLE_USUARIO}.numeroCracha,
        ${TABLE_USUARIO}.nome,
        ${TABLE_USUARIO}.nivel_acesso
      FROM ${TABLE_USUARIO}
      WHERE
        ${TABLE_USUARIO}.nivel_acesso = ?
        AND ${TABLE_USUARIO}.excluded = ?
    `, [3, 0]);

    return this.parseSelectResponse(rows);
  }
  
  /**
   * registerUser
   * Utiliza as várias globais do construtor para registrar um usuário no banco
   * @returns {Object} objecto parsed contendo informações da execução
   */
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

    console.log('user registered => ', this._nome);

    return this.parseInsertResponse(rows);
  }

  /**
   * updateUser
   * Atualiza os dados do usuário no banco
   * @returns {Object} objecto parsed contendo informações da execução
   */
  async updateUser() {
    const values = {
      numeroCracha: this._numeroCracha,
      senha: this._senha,
      nome: this._nome,
      funcao: this._funcao,
      email: this._email,
      nivel_acesso: this._nivelAcesso,
    };

    const [rows] = await this._mysql.query(/* SQL */ `
      UPDATE ${TABLE_USUARIO} SET ? WHERE numeroCracha = ?;
      `, [values, this._updateId],
    );

    console.log('user updated => ', this._nome);

    return this.parseInsertResponse(rows);
  }

  /**
   * deleteUser
   * Deleta o usuário desejado
   * @returns {Object} objecto parsed contendo informações da execução
   */
  async deleteUser() {
    const values = {
      excluded: 1,
    };

    const [rows] = await this._mysql.query(/* SQL */ `
      UPDATE ${TABLE_USUARIO} SET ? WHERE numeroCracha = ?;
      `, [values, this._updateId],
    );

    console.log('user deleted => ', this._updateId);

    return this.parseInsertResponse(rows);
  }
}
