const mysql = require('mysql');

const TABLE_VERIFICACAO = 'Verificacao';
const TABLE_ORDEM_SERVICO = 'ordemServico';
const TABLE_ORDEM_SERVICO_HAS_USUARIO = 'ordemServico_has_Usuario';
const TABLE_USUARIO = 'Usuario';

module.exports = class GetVerificationOrderData {
  constructor() {
    this.mysql = '';

    this.createConnection();
  }

  async getVerificationOrderData(user) {
    return new Promise((resolve, reject) => {
      this.mysql.query(/* sql */ `
                    SELECT ${TABLE_VERIFICACAO}.tipoVerificacao, ${TABLE_VERIFICACAO}.ordemServico_idOrdemServico, 
                    ${TABLE_VERIFICACAO}.dataVerificacao,${TABLE_VERIFICACAO}.problemaResolvido, 
                    ${TABLE_ORDEM_SERVICO}.Status_idStatus, ${TABLE_ORDEM_SERVICO}.tipoManutencao_idtipoManutencao, 
                    ${TABLE_ORDEM_SERVICO}.reporte,  ${TABLE_ORDEM_SERVICO}.solicitante, ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.Usuario_idUsuario,
                    ${TABLE_ORDEM_SERVICO}.resumo,${TABLE_ORDEM_SERVICO}.descricao,
                    ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.is_master,
                    user_report.nome AS name_report,
                    user_requester.nome AS name_requester,
                    user_maintainer.nome AS name_maintainer
                    FROM ${TABLE_VERIFICACAO}
                INNER JOIN ${TABLE_ORDEM_SERVICO} ON ${TABLE_ORDEM_SERVICO}.idOrdemServico = ${TABLE_VERIFICACAO}.ordemServico_idOrdemServico 
                INNER JOIN ${TABLE_ORDEM_SERVICO_HAS_USUARIO} ON ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.ordemServico_idOrdemServico = ${TABLE_VERIFICACAO}.ordemServico_idOrdemServico
                INNER JOIN ${TABLE_USUARIO} AS user_report ON user_report.idUsuario = ${TABLE_ORDEM_SERVICO}.reporte
                INNER JOIN ${TABLE_USUARIO} AS user_requester ON user_requester.idUsuario = ${TABLE_ORDEM_SERVICO}.solicitante
                INNER JOIN ${TABLE_USUARIO} AS user_maintainer ON user_maintainer.idUsuario =  ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.Usuario_idUsuario 
                WHERE user_maintainer.idUsuario = ? AND ${TABLE_ORDEM_SERVICO}.Status_idStatus = ? AND ${TABLE_ORDEM_SERVICO_HAS_USUARIO}.is_master = ?;
    `, [user, 6, 1], (err, res) => {
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
