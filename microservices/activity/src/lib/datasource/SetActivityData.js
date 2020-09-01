const mysql = require('mysql');

const ACTIVITY_TABLE = 'Atividades';

module.exports = class SetActivityData {
  constructor() {
    this.mysql = '';
    this.createConnection();
  }

  async setActivity({
    name, badge, email, date, activityId, note = '',
  } = {}) {
    try {
      const values = {
        activityId,
        usuario: name,
        cracha: badge,
        email,
        data: date,
        descricao: note,
      };
      
      return new Promise((resolve, reject) => {
        this.mysql.query(/* sql */ `
          INSERT INTO ${ACTIVITY_TABLE} SET ?
        `, values, (err, res) => {
          if (err) return reject(err);
          return resolve(res);
        });
      });
    } catch (err) {
      console.log('err :', err);
      throw err;
    }
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
