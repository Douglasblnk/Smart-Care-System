const OperationDao = require('../../dao/OperationDao');

const { ADMINISTRADOR_ID } = require('../../../../shared/constants/accessLevel');
const { get } = require('lodash');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

module.exports = class RegisterUpdateOperation {
  constructor() {
    this._queryReturn;
  }

  getParameters(req) {
    return {
      operationDescription: get(req.body, 'descricao_operacao', ''),
      material: get(req.body, 'material', ''),
      materialQuantity: get(req.body, 'quantidade_material', ''),
      materialUnit: get(req.body, 'unidade_material', ''),
      plannedTime: get(req.body, 'tempo_planejado', ''),
      updateId: get(req.params, 'id', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({
    operationDescription,
    material,
    materialQuantity,
    materialUnit,
    plannedTime,
    updateId,
    mysql,
    authData,
  }, type = '') {
    return {
      ...(!operationDescription ? { operationDescription: 'Descrição da operação não informada' } : ''),
      ...(!material ? { material: 'Material da operação não informado' } : ''),
      ...(!materialQuantity ? { materialQuantity: 'Quantidade do material informada' } : ''),
      ...(!materialUnit ? { materialUnit: 'Unidade do material não informada' } : ''),
      ...(!plannedTime ? { plannedTime: 'Tempo planejado da operação informado' } : ''),
      ...(type === 'update' && !updateId ? { updateId: 'Id do EPI a ser alterado não informada' } : ''),
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
      ...(!authData ? { authData: 'Dados de autenticação não encontrados' } : ''),
    };
  }

  async run(req, type = '') {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters, type);
      if (Object.values(errors).length > 0) throw errors;
      
      await this.validateGroups(parameters);

      await this.registerUpdateOperation(parameters, type);
      
      if (!this._queryReturn.affectedRows)
        throw type ? 'Nenhum registro foi alterado' : 'Nenhum registro foi inserido';

      return this._queryReturn;
    } catch (err) {
      console.log('err RegisterUpdateOperation :>> ', err);

      throw err;
    }
  }
  
  async registerUpdateOperation(parameters, type = '') {
    if (type === 'update')
      this._queryReturn = await new OperationDao(parameters).updateOperation();

    else this._queryReturn = await new OperationDao(parameters).registerOperation();
  }

  async validateGroups({ authData }) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
};
