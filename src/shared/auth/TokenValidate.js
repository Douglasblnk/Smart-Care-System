const { TABLE_USUARIO } = require('../constants/database');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../constants/HTTPResponse');

module.exports = async function TokenValidate({ numeroCracha }, mysql) {
  try {
    const [rows] = await mysql.query(/* SQL */`
      SELECT
        *
      FROM ${TABLE_USUARIO}
      WHERE ${TABLE_USUARIO}.numeroCracha = ?
    `, [numeroCracha]);
    
    const user = JSON.parse(JSON.stringify(rows));

    if (!user || user.length === 0)
      throw { status: STATUS_UNAUTHORIZED, msg: MESSAGE_UNAUTHORIZED };

    return rows;
  } catch (err) {
    console.log('err registerUser :>> ', err);

    throw err;
  }
};
