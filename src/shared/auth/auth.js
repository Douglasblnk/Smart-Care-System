const jwt = require('jsonwebtoken');

const TokenValidate = require('./TokenValidate');

module.exports = class Auth {
  constructor() {
    this._key = process.env.JWT_KEY;
    this._noAuthUrl = process.env.NO_AUTH_ROUTE;
    this._urlMethod = process.env.URL_METHOD;
  }

  async run(req, res, next) {
    try {
      if (req.url === this._noAuthUrl && req.method === this._urlMethod)
        return next();

      await this.jwtVerify(req);
      await TokenValidate(req.authData, req.mysql);
      next();
    } catch (err) {
      console.log('err Auth :>> ', err);
      res.status(401).send(err);
    }
  }

  jwtToken(user) {
    return new Promise((resolve, reject) => {
      jwt.sign(user, this._key, { expiresIn: '10h' }, (err, token) => {
        if (err) return reject(err);

        return resolve(token);
      });
    });
  }

  async jwtVerify(req) {
    try {
      const bearer = await this._getBearerToken(req);

      jwt.verify(bearer, this._key, (err, authData) => {
        if (err)
          throw { status: 401, msg: 'Erro ao autenticar!', ...err };
        
        req.authData = this.parseAuthData(authData);
        return;
      });
    } catch (err) {
      throw err;
    }
  }

  async _getBearerToken(req) {
    try {
      const bearerHeader = req.headers.authorization;

      if (!bearerHeader) throw { status: 401, msg: 'token inválido!' };
      if (!bearerHeader.includes('Bearer')) throw { status: 401, msg: 'token inválido!' };

      const bearer = bearerHeader.split(' ')[1];
      
      return bearer;
    } catch (err) {
      throw err;
    }
  }

  parseAuthData(authData) {
    return {
      idUsuario: authData.idUsuario,
      numeroCracha: authData.numeroCracha,
      nome: authData.nome,
      email: authData.email,
      funcao: authData.funcao,
      nivel_acesso: authData.nivel_acesso,
      excluded: authData.excluded,
    };
  }
};
