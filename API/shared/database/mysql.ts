import mysql = require("mysql");

export class Mysql {
  host: string;
  user: string;
  password: string;
  database: string;

  constructor(host: string, user: string, password: string, database: string) {
    this.host = host;
    this.user = user;
    this.password = password;
    this.database = database;
  }

  createConnection() {
    try {
      const connection = mysql.createConnection({
        host: this.host,
        user: this.user,
        password: this.password,
        database: this.database
      });
      
      connection.connect(err => {
        if (err) throw err;
      });

      return connection;
    } catch (err) {
      console.log('connection error: ', err);
      return err
    }
  }
}
