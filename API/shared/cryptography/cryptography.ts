const bcrypt = require ('bcryptjs');

export default class Cryptography {

  async compareHash(password: any, passwordHash: any) {
    return await new Promise((resolve, reject) => {
        bcrypt.compare(password, passwordHash, function(err: any, result: any) {  
            if (err || result === false) reject({ status: 401, msg: 'Login ou senha incorretos!', ...err })
            resolve(result);
        });
      });
  }

  async generateHash(password: any, saltRounds: any) {
    return await new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, function(err: any, hash: any) {
        if (err || hash === undefined) reject({ status: 401, msg: 'Não foi possível criar a senha!', ...err })
        resolve(hash)
      });
    })
  }
  
}