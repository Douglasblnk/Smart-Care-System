import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import TokenValidate from './TokenValidate';

export default class Auth {
  private _key: any;
  private _noAuthUrl: any;
  private _urlMethod: any;

  constructor() {
    this._key = process.env.JWT_KEY;
    this._noAuthUrl = process.env.NO_AUTH_ROUTE;
    this._urlMethod = process.env.URL_METHOD;
  }

  async run(req: any, res: Response, next: NextFunction) {
    try {
      if (req.url === this._noAuthUrl && req.method === this._urlMethod)
        return next();

      await this.jwtVerify(req);
      await new TokenValidate(req.authData, req.mysql).run();
      next();
    } catch (err) {
      console.log('err Auth :>> ', err);
      res.status(401).send(err);
    }
  }

  jwtToken(user: any): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(user, this._key, { expiresIn: '10h' }, (err: any, token: any) => {
        if (err) return reject(err);

        return resolve(token);
      });
    });
  }

  private async jwtVerify(req: any) {
    try {
      const bearer: any = await this.getBearerToken(req);

      jwt.verify(bearer, this._key, (err: any, authData: any) => {
        if (err)
          throw { status: 401, msg: 'Erro ao autenticar!', ...err };
        
        req.authData = this.parseAuthData(authData);
        return;
      });
    } catch (err) {
      throw err;
    }
  }

  private async getBearerToken(req: any) {
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

  private parseAuthData = (authData: any) => ({
    idUsuario: authData.idUsuario,
    numeroCracha: authData.numeroCracha,
    nome: authData.nome,
    email: authData.email,
    funcao: authData.funcao,
    nivel_acesso: authData.nivel_acesso,
    excluded: authData.excluded,
  })
}
