const { createConnection } = require('mysql2/promise');

module.exports = class ConnectionFactory {
  constructor() {
    this._config = {
      host: process.env.HOST,
      database: process.env.DATABASE,
      user: process.env.USER,
      password: process.env.PASSWORD,
    };
  }

  /**
   * Cria a comunicação com o Banco de dados
   * @param req requisição HTTP
   * @param res resposta da requisição
   * @param next função que passa o controle para o próximo middleware
   */
  async createConnection(req) {
    const connection = await createConnection(this._config);

    connection.connect();
    req.mysql = connection;

    req.next();
  }

  /**
   * Fecha a conexão com o Banco de dados ao fim da requisição
   * @param req requisição HTTP
   * @param res resposta da requisição
   * @param next função que passa o controle para o próximo middleware
   */
  closeConnection(req) {
    req.mysql.end();
    req.next();
  }
};
