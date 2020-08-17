import EquipmentsDao from '../../dao/crudModule/EquipmentsDao';

import { ADMINISTRADOR_ID } from '../../../../shared/constants/accessLevel';
import { authData } from '../../../../shared/types';
import { Connection } from 'mysql2/promise';
import { get } from 'lodash';
import { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } from '../../../../shared/constants/HTTPResponse';

export default class RegisterUpdateEquipments {
  _queryReturn: any;

  constructor() {
    this._queryReturn;
  }

  private getParameters = (req: { body: any, params: any, mysql: Connection }): {
    sectorId: number,
    equipment: string,
    superiorEquipment: string,
    descriptionEquipment: string,
    updateId: string,
    mysql: Connection,
    authData: authData,
  } => ({
    sectorId: get(req.body, 'Setor_idSetor', ''),
    equipment: get(req.body, 'equipamento', ''),
    superiorEquipment: get(req.body, 'equipamentoSuperior', ''),
    descriptionEquipment: get(req.body, 'descricao', ''),
    updateId: get(req.params, 'id', ''),
    mysql: get(req, 'mysql'),
    authData: get(req, 'authData', ''),
  })

  private checkParameters = ({
    sectorId, equipment, superiorEquipment, descriptionEquipment,
    updateId, mysql, authData,
  }: {
    sectorId: number,
    equipment: string,
    superiorEquipment: string,
    descriptionEquipment: string,
    updateId: string,
    mysql: Connection,
    authData: authData,
  }, type?: string) => ({
    ...(!sectorId ? { sectorId: 'Id do setor não informado' } : ''),
    ...(!equipment ? { equipment: 'Equipamento não informado' } : ''),
    ...(!superiorEquipment ? { superiorEquipment: 'Equipamento superior não informado' } : ''),
    ...(!descriptionEquipment ? { descriptionEquipment: 'Descrição do Equipamento não informado' } : ''),
    ...(type === 'update' && !updateId ? { updateId: 'Id do Equipamento a ser alterado não informado' } : ''),
    ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
    ...(!authData ? { authData: 'Dados de autenticação não encontrados' } : ''),
  })

  async run(req: { body: any, params: any, mysql: Connection }, type?: string) {
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
  
  private async registerUpdateEquipment(parameters: any, type?: string) {
    if (type === 'update')
      this._queryReturn = await new EquipmentsDao(parameters).updateEquipment();

    else this._queryReturn = await new EquipmentsDao(parameters).registerEquipment();
  }

  private async validateGroups({ authData }: { authData: authData}) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
}
