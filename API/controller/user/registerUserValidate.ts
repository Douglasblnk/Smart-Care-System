import Dao from '../../dao/Create';
import {SSUtils} from '../../utils/utils';
const _ = require('lodash');

const commitData = new Dao();
const isEmpty = new SSUtils();

const TABLE = 'Usuario';

export default class RegisterUserValidate {

  async run(event: any) {
    try {
      const data = this.getData(event);

      this.validateData(data);

      const dataQuery = this.getQuery(data);

      const result = await commitData.run(dataQuery);

      console.log('validation result', result);

      return result;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  getData(evt: any) {
    const data = evt.body || undefined;

    return data;
  }

  validateData(data: any) {
    console.log('data cru', data);
    if (_.isEmpty(data)) throw {
      status: 404,
      err: 'Não existem dados!',
    };
    
    isEmpty.verify(data,  ['nome', 'numeroCracha', 'senha', 'funcao', 'email', 'nivelAcesso'], '');

    if (data.numeroCracha === '') throw {
      status: 404,
      err: 'Crachá não informado',
    };

    if (data.senha === '') throw {
      status: 404,
      err: 'Senha não informada',
    };

    if (data.nome === '') throw {
      status: 404,
      err: 'Nome não informado',
    };

    if (data.funcao === '') throw {
      status: 404,
      err: 'Função não informado',
    };

    if (data.email === '') throw {
      status: 404,
      err: 'E-mail não informado',
    };

    if (data.nivelAcesso === '') throw {
      status: 404,
      err: 'nivel de acesso não informado',
    };
  }

  getQuery(data: any) {
    const post = { numeroCracha: data.numeroCracha, nivelAcesso: data.nivelAcesso, nome: data.nome, senha: data.senha, email: data.email, funcao: data.funcao };
    const query = /*sql*/`INSERT INTO ${TABLE} SET ?;`;

    const dataQuery = { query, post, type: 'Usuário' };

    return dataQuery;
  }
}