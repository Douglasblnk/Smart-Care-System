import userDao from '../../dao/userModule/UserDao';

import { ADMINISTRADOR_ID } from '../../../../shared/constants/accessLevel';
import { authData } from '../../../../shared/types';
import { Connection } from 'mysql2/promise';
import { get } from 'lodash';
import { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } from '../../../../shared/constants/HTTPResponse';

export default class DeleteUser {
  _queryReturn: any;

  constructor() {
    this._queryReturn;
  }

  private getParameters = (req: { params: any, mysql: Connection }): {
    updateId: string,
    mysql: Connection,
    authData: authData,
  } => ({
    updateId: get(req.params, 'id', ''),
    mysql: get(req, 'mysql'),
    authData: get(req, 'authData', ''),
  })

  private checkParameters = ({ updateId, mysql, authData }: {
    updateId: string,
    mysql: Connection,
    authData: authData,
  }) => ({
    ...(!updateId ? { numeroCracha: 'Crachá não informado' } : ''),
    ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
    ...(!authData ? { authData: 'Dados de autenticação não encontrados' } : ''),
  })

  async run(req: { params: any, mysql: Connection }) {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;
      
      await this.validateGroups(parameters);
      await this.deleteUser(parameters);
      
      if (!this._queryReturn.affectedRows)
        throw 'Não foi possível deletar o usuário';
      
      return this._queryReturn;
    } catch (err) {
      console.log('err registerUser :>> ', err);

      throw err;
    }
  }
  
  private async deleteUser(user: any) {
    this._queryReturn = await new userDao(user).deleteUser();
  }

  private async validateGroups({ authData }: { authData: authData}) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
}
