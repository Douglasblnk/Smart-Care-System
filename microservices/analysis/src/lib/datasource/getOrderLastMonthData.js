const mysql = require('mysql');

const ORDERS_TABLE = 'ordemServico';

module.exports = class GetOrderSummaryData {
  constructor() {
    this.mysql = '';

    this.createConnection();
  }

  async getOrderLastMonth() {
    return new Promise((resolve, reject) => {
      this.mysql.query(/* sql */ `
      SELECT count(*) AS Quantity,dataEmissao AS OpeningDate FROM ${ORDERS_TABLE} WHERE dataEmissao BETWEEN CURDATE() - INTERVAL 30 DAY AND CURDATE() GROUP BY WEEK (dataEmissao);
      `, (err, res) => {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  }

  async createConnection() {
    try {
      const connection = mysql.createConnection({
        host: 'duasrodasdb.cjh4gc3id4wo.sa-east-1.rds.amazonaws.com',
        user: 'adminDuasRodas',
        password: 'twowheels2020',
        database: 'duasrodas',
      });

      connection.connect(err => {
        if (err) throw err;
      });
      
      this.mysql = connection;
    } catch (err) {
      throw err;
    }
  }

  closeConnection() {
    this.mysql.end();
  }
};
