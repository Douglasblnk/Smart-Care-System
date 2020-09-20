const userDao = require('../../../dao/cruds/UserDao');

const { get } = require('lodash');

module.exports = class GetUsers {
  constructor() {
    this._queryReturn = '';
  }

  getParameters(req) {
    return {
      type: get(req.headers, 'type', ''),
      mysql: get(req, 'mysql'),
    };
  }

  checkParameters({ mysql } = {}) {
    return {
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
    };
  }

  async run(req) {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      await this.getUsers(parameters);

      return this.parseResult(this._queryResult);
    } catch (err) {
      console.log('err getUsers :>> ', err);

      throw err;
    }
  }

  async getUsers(parameters) {
    if (parameters.type === 'reporter')
      this._queryResult = await new userDao(parameters).getReporterUser();

    else if (parameters.type === 'requester')
      this._queryResult = await new userDao(parameters).getRequesterUser();

    else this._queryResult = await new userDao(parameters).getUsers();
  }

  parseResult(user) {
    if (!Array.isArray(user) && user.length === undefined) {
      return {
        idUsuario: user.idUsuario,
        numeroCracha: user.numeroCracha,
        nome: user.nome,
        email: user.email,
        funcao: user.funcao,
        nivel_acesso: user.nivel_acesso,
      };
    }

    return user.map(i => ({
      idUsuario: i.idUsuario,
      numeroCracha: i.numeroCracha,
      nome: i.nome,
      email: i.email,
      funcao: i.funcao,
      nivel_acesso: i.nivel_acesso,
    }));
  }
};
