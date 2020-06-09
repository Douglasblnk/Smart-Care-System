// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');

export default class Cryptography {
  compareHash(password: any, passwordHash: any) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, passwordHash, (err: any, result: any) => {
        if (err || result === false)
          return reject({ status: 401, msg: 'Login ou senha incorretos!', ...err });

        resolve(result);
      });
    });
  }

  generateHash(password: any): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, Number(process.env.SALT_ROUND), (err: any, hash: any) => {
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
  }
}
