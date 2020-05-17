import mysql from 'mysql2/promise'
import {
  TABLE_ORDEM_SERVICO_HAS_USUARIO,
  TABLE_ORDEM_SERVICO,
} from '../enums/database'
import _ from 'lodash'

export default class AssumeOrderTransaction {
  private _config: { host: string; user: string; password: string; database: string; };

  isMaster: any;
  _mysql!: mysql.Connection;

  constructor() {
    this._config = {
      host: 'duasrodasdb.cjh4gc3id4wo.sa-east-1.rds.amazonaws.com',
      user: 'adminDuasRodas',
      password: 'twowheels2020',
      database: 'duasrodas',
    }
    this.isMaster = true;

    this._mysql;
  }

  async runTransaction({
    userId,
    orderId,
  }: { userId: number, orderId: string }) {
    try {
      await this.createConnection();
      await this._mysql.beginTransaction();

      await this.insertUserIntoOrder({ userId, orderId, });
      await this.changeOrderStatus({ orderId, });
      
      await this._mysql.commit();
      this.closeConnection();

      return { result: 'Ordem Assumida!' }
    } catch (err) {
      console.log('err runTransaction :>> ', err);

      await this._mysql.rollback()
      throw err;
    }
  }

  private async insertUserIntoOrder({ 
    userId,
    orderId,
  }: { userId: number, orderId: string, }) {
    try {
      const queryValues = {
        ordemServico_idOrdemServico: orderId,
        Usuario_idUsuario: userId,
        excluded: 0,
        is_master: this.isMaster
      }

      return await this._mysql.query(/* SQL */`
        INSERT INTO ${TABLE_ORDEM_SERVICO_HAS_USUARIO}
        SET ?;
        `,
        queryValues,
      );
    } catch (err) {
      const error = this.getQueryError(err);

      throw error;
    }
  }

  private async changeOrderStatus({
    orderId, 
  }: { orderId: string, }) {
    try {
      const queryValues = [
        5, orderId
      ]

      return await this._mysql.query(/* SQL */`
        UPDATE ${TABLE_ORDEM_SERVICO}
          SET Status_idStatus = ?
        WHERE idOrdemServico = ?;
        `,
        queryValues,
      );
    } catch (err) {
      const error = this.getQueryError(err);
      
      throw error;
    }
  }

  private getQueryError(err: any): { status: number, err: string } {
    const error = Object.assign({}, err);

    if (_.has(error, 'code')) return { status: 400, err: 'Não foi possível concluir a operação!' };
    if (error.code === 'ER_DUP_ENTRY') return { status: 400, err: 'item já cadastrado!' };
    return { status: 400, err: _.get(error, 'message', 'Não foi possível concluir a operação!') }
  }

  private async createConnection() {
    try {
      this._mysql = await mysql.createConnection({...this._config});
    } catch (err) {
      throw err;
    }
  }

  private async closeConnection() {
    try {
      await this._mysql.end()
    } catch (err) {
      throw err;
    }
  }
}
