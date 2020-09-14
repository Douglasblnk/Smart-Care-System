const bcrypt = require('bcryptjs');

const compareHash = (password, passwordHash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, passwordHash, (err, result) => {
      if (err || result === false)
        return reject({ status: 401, msg: 'Login ou senha incorretos!', ...err });

      resolve(result);
    });
  });
};

const generateHash = password => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, Number(process.env.SALT_ROUND), (err, hash) => {
      if (err || hash === undefined) {
        return reject({
          status: 401,
          msg: 'Não foi possível criar a senha!',
          ...err,
        });
      }
      return resolve(hash);
    });
  });
};

module.exports = {
  compareHash,
  generateHash,
};
