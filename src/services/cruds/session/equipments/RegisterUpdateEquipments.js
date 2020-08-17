const EquipmentsDao = require('../../dao/crudModule/EquipmentsDao');

const { ADMINISTRADOR_ID } = require('../../../../shared/constants/accessLevel');
const { get } = require('lodash');
const { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } = require('../../../../shared/constants/HTTPResponse');

export default class RegisterUpdateEquipments {
  constructor() {
    this._queryReturn;
  }

  getParameters(req) {
    return {
      sectorId: get(req.body, 'Setor_idSetor', ''),
      equipment: get(req.body, 'equipamento', ''),
      superiorEquipment: get(req.body, 'equipamentoSuperior', ''),
      descriptionEquipment: get(req.body, 'descricao', ''),
      updateId: get(req.params, 'id', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({
    sectorId,
    equipment,
    superiorEquipment,
    descriptionEquipment,
    updateId,
    mysql,
    authData,
  }, type = '') {
    return {
      ...(!sectorId ? { sectorId: 'Id do setor não informado' } : ''),
      ...(!equipment ? { equipment: 'Equipamento não informado' } : ''),
      ...(!superiorEquipment ? { superiorEquipment: 'Equipamento superior não informado' } : ''),
      ...(!descriptionEquipment ? { descriptionEquipment: 'Descrição do Equipamento não informado' } : ''),
      ...(type === 'update' && !updateId ? { updateId: 'Id do Equipamento a ser alterado não informado' } : ''),
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

      await this.registerUpdateEquipment(parameters, type);
      
      if (!this._queryReturn.affectedRows)
        throw type ? 'Nenhum registro foi alterado' : 'Nenhum registro foi inserido';

      return this._queryReturn;
    } catch (err) {
      console.log('err registerUpdateEquipment :>> ', err);

      throw err;
    }
  }
  
  async registerUpdateEquipment(parameters, type = '') {
    if (type === 'update')
      this._queryReturn = await new EquipmentsDao(parameters).updateEquipment();

    else this._queryReturn = await new EquipmentsDao(parameters).registerEquipment();
  }

  async validateGroups({ authData }) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
}
