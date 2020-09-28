const UserDao = require('../../../dao/cruds/UserDao');

const { get } = require('lodash');

module.exports = class GetUsers {
  constructor() {
    this._queryResult = '';
  }

  getParameters(req) {
    return {
      orderId: get(req.headers, 'order_id'),
      type: get(req.headers, 'type', ''),
      mysql: get(req, 'mysql'),
    };
  }

  checkParameters({ orderId, type, mysql } = {}) {
    return {
      ...(type === 'maintainers' && !orderId ? { orderId: 'ID da ordem não infomado' } : ''),
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
    const functionName = `${parameters.type}Users`;
    
    this._queryResult = await dynamicGetUsers[functionName](parameters);
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

const dynamicGetUsers = {
  reporterUsers: async parameters => new UserDao(parameters).getReporterUser(),
  requesterUsers: parameters => new UserDao(parameters).getRequesterUser(),
  Users: parameters => new UserDao(parameters).getUsers(),
  maintainerUsers: parameters => new UserDao(parameters).getMaintainerUsersNotIntOrder(),
};
