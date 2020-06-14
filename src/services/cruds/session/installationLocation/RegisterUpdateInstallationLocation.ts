import InstallationLocationDao from '../../dao/crudModule/InstallationLocationDao';

import { ADMINISTRADOR_ID } from '../../../../shared/constants/accessLevel';
import { authData } from '../../../../shared/types';
import { Connection } from 'mysql2/promise';
import { get } from 'lodash';
import { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } from '../../../../shared/constants/HTTPResponse';

export default class RegisterUpdateInstallationLocation {
  _queryReturn: any;

  constructor() {
    this._queryReturn;
  }

  private getParameters = (req: { body: any, params: any, mysql: Connection }): {
    sector: string,
    updateId: string,
    mysql: Connection,
    authData: authData,
  } => ({
    sector: get(req.body, 'nome', ''),
    updateId: get(req.params, 'id', ''),
    mysql: get(req, 'mysql'),
    authData: get(req, 'authData', ''),
  })

  private checkParameters = ({ sector, updateId, mysql, authData }: {
    sector: string,
    updateId: string,
    mysql: Connection,
    authData: authData,
  }, type?: string) => ({
    ...(!sector ? { sector: 'Setor não informado' } : ''),
    ...(type === 'update' && !updateId ? { updateId: 'Id do Setor a ser alterado não informado' } : ''),
    ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
    ...(!authData ? { authData: 'Dados de autenticação não encontrados' } : ''),
  })

  async run(req: { body: any, params: any, mysql: Connection }, type?: string) {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters, type);
      if (Object.values(errors).length > 0) throw errors;
      
      await this.validateGroups(parameters);

      await this.registerUpdateInstallationLocation(parameters, type);
      
      if (!this._queryReturn.affectedRows)
        throw type ? 'Nenhum registro foi alterado' : 'Nenhum registro foi inserido';

      return this._queryReturn;
    } catch (err) {
      console.log('err RegisterUpdateInstallationLocation :>> ', err);

      throw err;
    }
  }
  
  private async registerUpdateInstallationLocation(parameters: any, type?: string) {
    if (type === 'update')
      this._queryReturn = await new InstallationLocationDao(parameters).updateSector();

    else this._queryReturn = await new InstallationLocationDao(parameters).registerSector();
  }

  private async validateGroups({ authData }: { authData: authData}) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
}
