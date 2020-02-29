const mysql = require('mysql');

const ACTIVITY_TABLE = 'atividades';

module.exports = class SetActivityData {
  constructor(nome, cracha, email, date, activityId, description) {
    this._nome = nome;
    this._cracha = cracha;
    this._email = email;
    this._date = date;
    this._activityId = activityId;
    this._description = description;

    this.validateParameters();
  }

  async setActivity() {
    try {
      const con = await this.createConnection();
  
      const values = this.getValuesMapped();
      
      new Promise((resolve, reject) => {
        con.query(/* sql */ `
          INSERT INTO ${ACTIVITY_TABLE} SET ?
        `, values, (err, res) => {
          if (err) reject(err);
          resolve(res);
        });
      });
      con.end();
      return;
    } catch (err) {
      console.log('err :', err);
      throw err;
    }
  }

  getValuesMapped() {
    return {
      activityId: this._activityId,
      usuario: this._nome,
      cracha: this._cracha,
      email: this._email,
      data: this._date,
      descricao: this._description,
    };
  }

  async createConnection() {
    try {
      const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'duasrodas',
      });

      connection.connect(err => {
        if (err) throw err;
      });

      return connection;
    } catch (err) {
      throw err;
    }
  }

  validateParameters() {
    try {
      if (!this._nome) throw (400, { nome: 'undefined' });
      if (!this._cracha) throw (400, { cracha: 'undefined' });
      if (!this._email) throw (400, { email: 'undefined' });
      if (!this._date) throw (400, { date: 'undefined' });
      if (!this._activityId) throw (400, { activityId: 'undefined' });
    } catch (err) {
      console.log('err :', err);
      throw err;
    }
  }
};
