const userDao = require('../../../dao/cruds/UserDao');
const { compareHash } = require('../../../../shared/guard/cryptography');
const JwtToken = require('../../../../shared/auth/auth');

// eslint-disable-next-line no-unused-vars
const { get } = require('lodash');

module.exports = class LoginValidate {
  constructor() {
    this._queryResult = '';
  }

  getParameters(req) {
    return {
      numeroCracha: get(req.body, 'numeroCracha', ''),
      senha: get(req.body, 'senha', ''),
      mysql: get(req, 'mysql'),
    };
  }

  checkParameters({ numeroCracha, senha, mysql } = {}) {
    return {
      ...(!numeroCracha ? { numeroCracha: 'Crachá não informado' } : ''),
      ...(!senha ? { senha: 'Senha não informada' } : ''),
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
    };
  }

  async run(req) {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      await this.makeLogin(parameters);

      return this._queryResult;
    } catch (err) {
      console.log('err loginValidate :>> ', err);

      throw err;
    }
  }

  async makeLogin(parameters) {
    const user = await new userDao(parameters).makeLogin();

    await this.validateUser(parameters, user);
    const token = await this.createToken(user);

    console.log('validated :>> ', user.nome);

    this._queryResult = this.parseResult(user, token);
  }

  createToken(user) {
    return new JwtToken().jwtToken(user);
  }

  async validateUser(parameters, user) {
    await compareHash(parameters.senha, user.senha);
  }

  parseResult(user, token) {
    return {
      idUsuario: user.idUsuario,
      numeroCracha: user.numeroCracha,
      nome: user.nome,
      email: user.email,
      funcao: user.funcao,
      nivel_acesso: user.nivel_acesso,
      token,
    };
  }
};
