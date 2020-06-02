// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
// eslint-disable-next-line no-unused-vars

export default class Auth {
  private _key: any;
  private _noAuthUrl: any;
  private _urlMethod: any;

  constructor() {
    this._key = process.env.JWT_KEY;
    this._noAuthUrl = process.env.NO_AUTH_ROUTE;
    this._urlMethod = process.env.URL_METHOD;
  }

  async run(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.url === this._noAuthUrl && req.method === this._urlMethod)
        return next();

      await this.jwtVerify(req);
      next();
    } catch (err) {
      console.log('err Auth :>> ', err);
      res.status(401).send(err);
    }
  }

  jwtToken(user: any) {
    return new Promise((resolve, reject) => {
      jwt.sign(user, this._key, { expiresIn: '10h' }, (err: any, token: any) => {
        if (err) return reject(err);

        return resolve(token);
      });
    });
  }

  private async jwtVerify(req: Request) {
    try {
      const bearer: any = await this.getBearerToken(req);

      jwt.verify(bearer, this._key, (err: any, authData: any) => {
        if (err)
          throw { status: 401, msg: 'Erro ao autenticar!', ...err };

        return { body: authData };
      });
    } catch (err) {
      throw err;
    }
  }

  private async getBearerToken(req: Request) {
    try {
      const bearerHeader: any = req.headers.authorization;

      if (!bearerHeader) throw { status: 401, msg: 'token inválido!' };
      if (!bearerHeader.includes('Bearer')) throw { status: 401, msg: 'token inválido!' };

      const bearer = bearerHeader.split(' ')[1];
      
      return bearer;
    } catch (err) {
      throw err;
    }
  }
}
