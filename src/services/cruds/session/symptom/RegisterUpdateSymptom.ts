import SymptomDao from '../../dao/SymptomDao';

import { ADMINISTRADOR_ID } from '../../../../shared/constants/accessLevel';
import { authData } from '../../../../shared/types';
import { Connection } from 'mysql2/promise';
import { get } from 'lodash';
import { STATUS_UNAUTHORIZED, MESSAGE_UNAUTHORIZED } from '../../../../shared/constants/HTTPResponse';

export default class RegisterUpdateSymptom {
  _queryReturn: any;

  constructor() {
    this._queryReturn;
  }

  private getParameters = (req: { body: any, params: any, mysql: Connection }): {
    symptomDescription: string,
    updateId: string,
    mysql: Connection,
    authData: authData,
  } => ({
    symptomDescription: get(req.body, 'descricaoSintomas', ''),
    updateId: get(req.params, 'id', ''),
    mysql: get(req, 'mysql'),
    authData: get(req, 'authData', ''),
  })

  private checkParameters = ({ symptomDescription, updateId, mysql, authData }: {
    symptomDescription: string,
    updateId: string,
    mysql: Connection,
    authData: authData,
  }, type?: string) => ({
    ...(!symptomDescription ? { symptomDescription: 'Descrição do sintoma não informado' } : ''),
    ...(type === 'update' && !updateId ? { updateId: 'Id da descrição a ser alterada não informada' } : ''),
    ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
    ...(!authData ? { authData: 'Dados de autenticação não encontrados' } : ''),
  })

  async run(req: { body: any, params: any, mysql: Connection }, type?: string) {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters, type);
      if (Object.values(errors).length > 0) throw errors;
      
      await this.validateGroups(parameters);

      await this.registerUpdateSymptom(parameters, type);
      
      if (!this._queryReturn.affectedRows)
        throw type ? 'Nenhum registro foi alterado' : 'Nenhum registro foi inserido';

      return this._queryReturn;
    } catch (err) {
      console.log('err registerUser :>> ', err);

      throw err;
    }
  }
  
  private async registerUpdateSymptom(user: any, type?: string) {
    if (type === 'update')
      this._queryReturn = await new SymptomDao(user).updateSymptom();

    else this._queryReturn = await new SymptomDao(user).registerSymptom();
  }

  private async validateGroups({ authData }: { authData: authData}) {
    if (authData.nivel_acesso !== ADMINISTRADOR_ID)
      throw { status: STATUS_UNAUTHORIZED, message: MESSAGE_UNAUTHORIZED };
  }
}
