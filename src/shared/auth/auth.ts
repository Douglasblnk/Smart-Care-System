// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// eslint-disable-next-line no-unused-vars

export default class Auth {
  private _key: any;
  private _noAuth: any;

  constructor() {
    this._key = process.env.JWT_KEY;
    this._noAuth = process.env.NO_AUTH_ROUTE;
  }

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.url === this._noAuth)
        return next();

      
      next();
    } catch (err) {
      console.log('err Auth :>> ', err);
      throw err;
    }
  }

  jwtToken(res: any) {
    return new Promise((resolve, reject) => {
      jwt.sign(res.result, this._key, { expiresIn: '10h' }, (err: any, token: any) => {
        if (err) return reject(err);

        return resolve({ status: 200, token });
      });
    });
  }

  private jwtVerify(token: any) {
    return new Promise((resolve, reject) => {
      const bearer: any = this.getBearerToken(token);

      jwt.verify(bearer, this._key, (err: any, authData: any) => {
        if (err) {
          console.log('Authentication error:', err );
          return reject({ status: 401, msg: 'Erro ao autenticar!', ...err });
        }
        return resolve({ body: authData });
      });
    });
  }

  private getBearerToken(token: any) {
    return new Promise((resolve, reject) => {
      const bearerHeader = token.headers['authorization'];

      if (typeof bearerHeader === undefined) return reject('token inválido!');
      if (!bearerHeader.includes('Bearer')) return reject('token inválido');

      const bearer = bearerHeader.split(' ')[1];
      
      return resolve(bearer);
    });
  }
}
