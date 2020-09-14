const GenericDao = require('../GenericDao');
const { TABLE_COMPONENTE } = require('../../../shared/constants/database');

module.exports = class ComponentDao extends GenericDao {
  constructor({
    componentDescription,
    equipmentId,
    updateId,
    mysql,
  } = {}) {
    super();

    this._componentDescription = componentDescription;
    this._equipmentId = equipmentId;
    this._updateId = updateId;
    this._mysql = mysql;
  }

  /**
   * getComponents
   * Busca todos os componentes
   * @return {Array} parsed array com todos os componentes
   */
  async getComponents() {
    const [rows] = await this._mysql.query(/* SQL */`
      SELECT 
        * 
      FROM ${TABLE_COMPONENTE}
      WHERE ${TABLE_COMPONENTE}.excluded = ?;
    `, [0]);

    return this.parseSelectResponse(rows);
  }

  /**
   * registerComponent
   * Registra um componente no sistema
   * @return {Array} parsed array com dados da inserção
   */
  async registerComponent() {
    const values = {
      DescricaoComponente: this._componentDescription,
      Equipamento_idEquipamento: this._equipmentId,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      INSERT INTO ${TABLE_COMPONENTE} SET ?;
    `, [values]);

    return this.parseInsertResponse(rows);
  }

  /**
   * updateComponent
   * Altera um componente no sistema
   * @return {Array} parsed array com dados da alteração
   */
  async updateComponent() {
    const values = {
      DescricaoComponente: this._componentDescription,
      Equipamento_idEquipamento: this._equipmentId,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_COMPONENTE} SET ? WHERE idComponente = ?;
    `, [values, this._updateId]);

    return this.parseInsertResponse(rows);
  }

  /**
   * deleteComponent
   * remove um componente do sistema
   * @return {Array} parsed array com as informações de deleção
   */
  async deleteComponent() {
    const values = {
      excluded: 1,
    };

    const [rows] = await this._mysql.query(/* SQL */`
      UPDATE ${TABLE_COMPONENTE} SET ?
      WHERE ${TABLE_COMPONENTE}.idComponente = ?;
    `, [values, this._updateId]);

    return this.parseInsertResponse(rows);
  }
};
