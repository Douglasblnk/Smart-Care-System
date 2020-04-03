const mysql = require('mysql');

const ACTIVITY_TABLE = 'Atividades';

module.exports = class SetActivityData {
  constructor(nome, cracha, email, date, activityId, descricao) {
    this._nome = nome;
    this._cracha = cracha;
    this._email = email;
    this._date = date;
    this._activityId = activityId;
    this._descricao = descricao;

    this.validateParameters();

    this.mysql = '';
    this.createConnection();
  }

  async setActivity() {
    try {
      const values = this.getValuesMapped();
      
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

  getValuesMapped() {
    return {
      activityId: this._activityId,
      usuario: this._nome,
      cracha: this._cracha,
      email: this._email,
      data: this._date,
      descricao: this._descricao,
    };
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

  closeConnection() {
    this.mysql.end();
  }
};
