const GenericDao = require('../GenericDao');
const { TABLE_EQUIPAMENTO } = require('../../../../shared/constants/database');

module.exports = class EquipmentsDao extends GenericDao {
  constructor({
    mysql,
    sectorId,
    equipment,
    superiorEquipment,
    descriptionEquipment,
    updateId,
  } = {}) {
    super();

    this._mysql = mysql;
    this._sectorId = sectorId;
    this._equipment = equipment;
    this._superiorEquipment = superiorEquipment;
    this._descriptionEquipment = descriptionEquipment;
    this._updateId = updateId;
  }

  /**
   * getEquipments
   * Busca todos os Equipamentos das ordens de manutenções
   * @return {Array} parsed array com todos os Equipamentos
   */
  async getEquipments() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT 
        * 
      FROM ${TABLE_EQUIPAMENTO}
      WHERE ${TABLE_EQUIPAMENTO}.excluded = ?;
    `, [0]);

    return this.parseSelectResponse(rows);
  }

  /**
   * registerEquipment
   * Registra um equipamento no sistema
   * @return {Array} parsed array com dados da inserção
   */
  async registerEquipment() {
    const values = {
      Setor_idSetor: this._sectorId,
      descricao: this._descriptionEquipment,
      equipamento: this._equipment,
      equipamentoSuperior: this._superiorEquipment,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      INSERT INTO ${TABLE_EQUIPAMENTO} SET ?;
    `, [values]);

    return this.parseInsertResponse(rows);
  }

  /**
   * updateEquipment
   * Altera um equipamento no sistema
   * @return {Array} parsed array com dados da alteração
   */
  async updateEquipment() {
    const values = {
      Setor_idSetor: this._sectorId,
      descricao: this._descriptionEquipment,
      equipamento: this._equipment,
      equipamentoSuperior: this._superiorEquipment,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_EQUIPAMENTO} SET ? WHERE idEquipamento = ?;
    `, [values, this._updateId]);

    return this.parseInsertResponse(rows);
  }

  /**
   * deleteEquipment
   * remove um equipamento do sistema
   * @return {Array} parsed array com as informações de deleção
   */
  async deleteEquipment() {
    const values = {
      excluded: 1,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_EQUIPAMENTO} SET ?
      WHERE ${TABLE_EQUIPAMENTO}.idEquipamento = ?;
    `, [values, this._updateId]);

    return this.parseInsertResponse(rows);
  }
}
