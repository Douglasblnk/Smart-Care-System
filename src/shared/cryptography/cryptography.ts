const bcrypt = require('bcryptjs');

export default class Cryptography {
  compareHash(password: any, passwordHash: any) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, passwordHash, (err: any, result: any) => {
        if (err || result === false)
          reject({ status: 401, msg: 'Login ou senha incorretos!', ...err });
        resolve(result);
      });
    });
  }

  generateHash(password: any, saltRounds: any) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err: any, hash: any) => {
        if (err || hash === undefined) {
          reject({
            status: 401,
            msg: 'Não foi possível criar a senha!',
            ...err,
          });
        }
        resolve(hash);
      });
    });
  }
}
