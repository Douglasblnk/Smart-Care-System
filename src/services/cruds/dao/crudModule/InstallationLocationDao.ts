import GenericDao from '../GenericDao';
import { TABLE_SETOR } from '../../../../shared/constants/database';
import { Connection } from 'mysql2/promise';

export default class InstallationLocationDao extends GenericDao {
  _mysql: Connection;
  _sector?: string;
  _updateId?: string;
  constructor({
    mysql,
    sector,
    updateId,
  }: { mysql: Connection, sector?: string, updateId?: string }) {
    super();

    this._mysql = mysql;
    this._sector = sector;
    this._updateId = updateId;
  }

  /**
   * getSector
   * Busca todos os Locais de instalação das ordens de manutenções
   * @return {Array} parsed array com todos os Locais de Instalação
   */
  async getSector() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT 
        * 
      FROM ${TABLE_SETOR}
      WHERE ${TABLE_SETOR}.excluded = 0;
    `, [0]);

    return this.parseSelectResponse(rows);
  }

  /**
   * registerEquipment
   * Registra um equipamento no sistema
   * @return {Array} parsed array com dados da inserção
   */
//   async registerEquipment() {
//     const values = {
//       Setor_idSetor: this._sectorId,
//       descricao: this._descriptionEquipment,
//       equipamento: this._equipment,
//       equipamentoSuperior: this._superiorEquipment,
//     };
//     const [rows] = await this._mysql.query(/* SQL */`
//       INSERT INTO ${TABLE_EQUIPAMENTO} SET ?;
//     `, [values]);

//     return this.parseInsertResponse(rows);
//   }

  /**
   * updateEquipment
   * Altera um equipamento no sistema
   * @return {Array} parsed array com dados da alteração
   */
//   async updateEquipment() {
//     const values = {
//       Setor_idSetor: this._sectorId,
//       descricao: this._descriptionEquipment,
//       equipamento: this._equipment,
//       equipamentoSuperior: this._superiorEquipment,
//     };
//     const [rows] = await this._mysql.query(/* SQL */`
//     UPDATE ${TABLE_EQUIPAMENTO} SET ? WHERE idEquipamento = ?;
//     `, [values, this._updateId]);

//     return this.parseInsertResponse(rows);
//   }

  /**
   * deleteEquipment
   * remove um equipamento do sistema
   * @return {Array} parsed array com as informações de deleção
   */
//   async deleteEquipment() {
//     const values = {
//       excluded: 1,
//     };

//     const [rows] = await this._mysql.query(/* SQL */`
//       UPDATE ${TABLE_EQUIPAMENTO} SET ?
//       WHERE ${TABLE_EQUIPAMENTO}.idEquipamento = ?;
//     `, [values, this._updateId]);

//     return this.parseInsertResponse(rows);
//   }
}
