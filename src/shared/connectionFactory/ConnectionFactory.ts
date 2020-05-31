import { createConnection, Connection } from 'mysql2/promise';

export default class ConnectionFactory {
  private _config: { host: any, database: any, user: any, password: any, };

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
  async createConnection(req: any, res: any, next: any) {
    const connection: Connection = await createConnection(this._config);

    connection.connect();
    req.mysql = connection;

    next();
  }

  /**
   * Fecha a conexão com o Banco de dados ao fim da requisição
   * @param req requisição HTTP
   * @param res resposta da requisição
   * @param next função que passa o controle para o próximo middleware
   */
  closeConnection(req: any, res: any, next: any) {
    req.mysql.end();
    next();
  }
}
