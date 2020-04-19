const mysql = require('mysql');

const ORDERS_TABLE = 'ordemServico';

module.exports = class GetOrderSummaryData {
  constructor() {
    this.mysql = '';

    this.createConnection();
  }

  async getSummary() {
    return new Promise((resolve, reject) => {
      this.mysql.query(/* sql */ `
        SELECT
          (SELECT count(*) FROM ${ORDERS_TABLE} WHERE Status_idStatus = 1) as openOrders,
          (SELECT count(*) FROM ${ORDERS_TABLE} WHERE Status_idStatus = 2) as currentOrders,
          (SELECT count(*) FROM ${ORDERS_TABLE} WHERE Status_idStatus = 3) as finishOrders,
          (SELECT count(*) FROM ${ORDERS_TABLE} WHERE Status_idStatus = 4) as canceledOrders
        FROM ${ORDERS_TABLE}
        GROUP BY openOrders
      `, (err, res) => {
        if (err) return reject(err);
        return resolve(res[0]);
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
