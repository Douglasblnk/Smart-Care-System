import Update from '../../dao/Update';
import {SSUtils} from '../../utils/utils';
const _ = require('lodash');

const commitData = new Update();
const isEmpty = new SSUtils();

const TABLE = 'usuario';

export default class UpdateUserValidate {

  async run(event: any) {
    try {
      const data = this.getData(event);

      this.validateData(data);

      const getQuery = this.getQuery(data)

      const result = await commitData.run(getQuery);
      console.log('cheguei até aqui');
      return result;
    } catch (err) {
      console.log(err);

      throw err;
    }
  }

  getData(evt: any) {
    const data = evt.body || undefined;
    data.id = evt.params.id || undefined;

    return data;
  }

  validateData(data: any) {
    console.log('data cru', data);
    if (_.isEmpty(data)) throw {
      status: 404,
      err: 'Não existem dados!',
    };

    if (data.id === '' || data.id === undefined) throw {
      status: 404,
      err: 'Não foi possível encontrar o usuário!'
    }
    
    isEmpty.verify(data,  ['nome', 'numeroCracha', 'funcao', 'email', 'senha', 'nivelAcesso'], '');
    
    if (data.nome === '') throw {
      status: 404,
      err: 'Nome não informado',
    };

    if (data.numeroCracha === '') throw {
      status: 404,
      err: 'Crachá não informado',
    };

    if (data.funcao === '') throw {
      status: 400,
      err: 'Função não informada',
    };

    if (data.email === '') throw {
      status: 400,
      err: 'E-mail não informado',
    };

    if (data.senha === '') throw {
      status: 400,
      err: 'Senha não informada',
    };

    if (data.nivelAcesso === '') throw {
      status: 400,
      err: 'Nível de acesso não informada',
    };
  }

  getQuery(data: any) {
    const values = { numeroCracha: data.numeroCracha, nivelAcesso: data.nivelAcesso, nome: data.nome, senha: data.senha, email: data.email, funcao: data.funcao };
    const where = data.id;
    const query = /*sql*/`UPDATE ${TABLE} SET ? WHERE numeroCracha = ?;`;

    const dataQuery = { query, values, where, type: 'Usuário' };
    console.log(dataQuery);
    return dataQuery;
  }
}