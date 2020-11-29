const { get } = require('lodash');

const DelegateMaintainerDao = require('../../../dao/movimentations/DelegateMaintainer');
const UserDao = require('../../../dao/cruds/UserDao');

const { ADMINISTRADOR_ID, MANUTENTOR_ID } = require('../../../../shared/constants/accessLevel');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

module.exports = class DelegateMaintainer {
  getParameters(req) {
    return {
      orderId: get(req.body, 'orderId', ''),
      cracha: get(req.body, 'numeroCracha', ''),
      name: get(req.body, 'nome', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({
    orderId,
    cracha,
    name,
    mysql,
    authData,
  }) {
    return {
      ...(!orderId ? { orderId: 'Id da ordem não informado' } : ''),
      ...(!cracha ? { cracha: 'Cracha não informado' } : ''),
      ...(!name ? { name: 'Nome não informado' } : ''),
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
      ...(!authData ? { authData: 'Dados de autenticação não encontrados' } : ''),
    };
  }

  async run(req) {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;
      
      await this.validateGroups(parameters);
      await this.validateMaintainerPermissions(parameters);
      const { idUsuario: newMaintainerId } = await this.getMaintainerByCracha(parameters);
      
      const response = await this.delegateMaintainer({ ...parameters, newMaintainerId });
      
      if (!response.affectedRows)
        throw 'Nenhum registro foi inserido';

      return response;
    } catch (err) {
      console.log('err DelegateMaintainer :>> ', err);
      throw err;
    }
  }

  async delegateMaintainer(parameters) {
    return new DelegateMaintainerDao(parameters).delegateMaintainer();
  }

  async getMaintainerByCracha({ cracha, mysql }) {
    return new UserDao({ numeroCracha: cracha, mysql }).getUserByCracha();
  }

  async validateMaintainerPermissions(parameters) {
    const masterMaintainer = await this.getMaintainersInOrder(parameters);

    const error = 'Não é possível executar a ação sem ter assumido a ordem!';

    if (!masterMaintainer) throw error;
    else if (Array.isArray(masterMaintainer) && !masterMaintainer.length) throw error;

    if (parameters.authData.numeroCracha !== masterMaintainer.numeroCracha)
      throw 'Somente o manutentor que assumiu a ordem pode delegar!';
  }

  async getMaintainersInOrder(parameters) {
    const maintainersInOrder = await new UserDao(parameters).getMaintainersInOrder();

    if (Array.isArray(maintainersInOrder) && maintainersInOrder.lenght !== undefined)
      return maintainersInOrder.find(i => i.is_master);
    
    return maintainersInOrder;
  }

  async validateGroups({ authData }) {
    if (![MANUTENTOR_ID, ADMINISTRADOR_ID].includes(authData.nivel_acesso))
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
