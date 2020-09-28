const ComponentsDao = require('../../../dao/cruds/ComponentsDao');

const { ADMINISTRADOR_ID } = require('../../../../shared/constants/accessLevel');
const { get } = require('lodash');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

module.exports = class RegisterUpdateComponent {
  constructor() {
    this._queryResult = '';
  }

  getParameters(req) {
    return {
      componentDescription: get(req.body, 'DescricaoComponente', ''),
      equipmentId: get(req.body, 'Equipamento_idEquipamento', ''),
      updateId: get(req.params, 'id', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({
    componentDescription,
    equipmentId,
    updateId,
    mysql,
    authData,
  }, type = '') {
    return {
      ...(!componentDescription ? { componentDescription: 'Componente não informado' } : ''),
      ...(!equipmentId ? { equipmentId: 'ID do equipamento não informado' } : ''),
      ...(type === 'update' && !updateId ? { updateId: 'Id do Equipamento a ser alterado não informado' } : ''),
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
      ...(!authData ? { authData: 'Dados de autenticação não encontrados' } : ''),
    };
  }

  async run(req, type = '') {
    try {
      const parameters = this.getParameters(req);
      console.log('parameters :>> ', parameters);
      const errors = this.checkParameters(parameters, type);
      if (Object.values(errors).length > 0) throw errors;

      await this.validateGroups(parameters);

      await this.registerUpdateComponent(parameters, type);

      if (!this._queryResult.affectedRows)
        throw type ? 'Nenhum registro foi alterado' : 'Nenhum registro foi inserido';

      return this._queryResult;
    } catch (err) {
      console.log('err RegisterUpdateComponent :>> ', err);

      throw err;
    }
  }

  async registerUpdateComponent(parameters, type = '') {
    if (type === 'update')
      this._queryResult = await new ComponentsDao(parameters).updateComponent();

    else this._queryResult = await new ComponentsDao(parameters).registerComponent();
  }

  async validateGroups({ authData }) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
