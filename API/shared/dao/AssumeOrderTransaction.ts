import { Mysql } from '../database/mysql'
import _ from 'lodash'


export default class AssumeOrderTransaction {
  _mysql: any;
  isMaster: any;
  cracha: any;
  nivelAcesso: any;
  orderId: any;

  constructor({
    cracha,
    nivelAcesso,
    orderId,
  }: { cracha: string, nivelAcesso: string, orderId: string }) {
    this.isMaster = true;
    this.cracha = cracha;
    this.nivelAcesso = nivelAcesso;
    this.orderId = orderId;
    
    this.createConnection()
    this._mysql;
  }

  async runTransaction() {
    this._mysql.beginTransaction();
    try {
      await this.insertUserIntoOrder();

    } catch (err) {
      console.log('err runTransaction :>> ', err);
      throw err;
    }
  }
  private async insertUserIntoOrder() {
    try {
      const queryValues = {
        ordemServico_idOrdemServico: this.orderId,
        Usuario_idUsuario: this.cracha,
        excluded: 0,
        is_master: this.isMaster
      }

      const response = await this._mysql.query(/* SQL */`
        INSERT INTO duasrodas.ordemServico_has_Usuario
        SET ?;
        `,
        queryValues,
      );
    } catch (err) {
      throw err;
    }
  }

  private getQueryError(err: any) {
    const error = JSON.parse(JSON.stringify(err));
    if (!_.has(error, 'code')) return { status: 400, err: 'Ocorreu um erro na hora de salvar os dados' };
    if (error.code === 'ER_DUP_ENTRY') return { status: 400, err: 'item já cadastrado!' };
  }

  private async createConnection() {
    try {
      const connection = new Mysql(
        'duasrodasdb.cjh4gc3id4wo.sa-east-1.rds.amazonaws.com',
        'adminDuasRodas',
        'twowheels2020',
        'duasrodas'
      ).createConnection()

      this._mysql = connection;
    } catch (err) {
      throw err;
    }
  }
}
