import jwt from 'jsonwebtoken';

export default class Auth {
  _key: any;
  constructor() {
    this._key = process.env.JWT_KEY;
  }

  jwtToken(res: any) {
    return new Promise((resolve, reject) => {
      jwt.sign(res.result, this._key, { expiresIn: '12h' }, (err: any, token: any) => {
        if (err) reject(err);

        resolve({ status: 200, token });
      });
    });
  }

  jwtVerify(token: any) {
    return new Promise(async (resolve, reject) => {
      const bearer: any = await this.getBearerToken(token);

      console.log('bearer: ', bearer);

      jwt.verify(bearer, this._key, (err: any, authData: any) => {
        console.log('Autenticação error:', err );

        if (err) reject({ status: 401, msg: 'Erro ao autenticar!', ...err });

        resolve({ body: authData });
      });
    });
  }

  getBearerToken(token: any) {
    return new Promise((resolve, reject) => {
      const bearerHeader = token.headers['authorization'];

      if (typeof bearerHeader === undefined) reject('token inválido!');

      const bearer = bearerHeader.split(' ')[1];
      
      resolve(bearer);
    });
  }
}
