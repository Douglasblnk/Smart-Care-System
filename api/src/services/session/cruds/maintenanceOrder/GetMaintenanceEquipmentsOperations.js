const { get } = require('lodash');
const { PREVENTIVE_TEXT, LIST_TEXT, ROUTE_TEXT, CORRECTIVE_TEXT } = require('../../../../shared/constants/orderType');

const MaintenanceOrderDao = require('../../../dao/cruds/MaintenanceOrderDao');

module.exports = class GetMaintenanceEquipmentsOperations {
  getParameters(req) {
    return {
      order: get(req.headers, 'order', ''),
      orderType: get(req.headers, 'order_type', ''),
      mysql: get(req, 'mysql'),
    };
  }

  checkParameters({ mysql, order, orderType } = {}) {
    return {
      ...(!order ? { order: 'Ordem não informada!' } : ''),
      ...(!orderType ? { orderType: 'Tipo da ordem não informado!' } : ''),
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
    };
  }

  async run(req) {
    try {
      const parameters = this.getParameters(req);
      
      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      const equipments = await this.getMaintenanceEquipments(parameters);
      
      const equipmentsOperations = await this.getEquipmentsOperations(parameters, equipments);

      return equipmentsOperations;
    } catch (err) {
      console.log('err GetMaintenanceEquipmentsOperations :>> ', err);

      throw err;
    }
  }

  async getMaintenanceEquipments(parameters) {
    return new MaintenanceOrderDao(parameters).getEquipments();
  }

  async getEquipmentsOperations({ mysql, order, orderType }, equipments) {
    const operations = ([LIST_TEXT, PREVENTIVE_TEXT].includes(orderType))
      ? await this.getOneEquipmentOperations({ mysql, order }, equipments)
      : await this.getOperations({ mysql, order }, equipments);

    return orderType === CORRECTIVE_TEXT
      ? this.mountEquipmentsResponse(equipments, orderType)
      : this.mountOperationsResponse(operations, equipments, orderType);
  }

  async getOperations({ mysql, order }, equipments) {
    const promises = equipments.map(({ idEquipamento }) => new MaintenanceOrderDao({
      mysql,
      order,
      equipmentId: idEquipamento,
    }).getOperations());

    return Promise.all(promises);
  }

  async getOneEquipmentOperations({ mysql, order }, [{ idEquipamento }]) {
    return new MaintenanceOrderDao({
      mysql,
      order,
      equipmentId: idEquipamento,
    }).getOperations();
  }

  mountOperationsResponse(operations, equipments, orderType) {
    return {
      equipments: equipments.reduce((acc, value, index) => {
        acc.push({
          ...value,
          operations: this.getOperationsArray(orderType, operations, index),
        });
  
        return acc;
      }, []),
    };
  }

  getOperationsArray(orderType, operations, index) {
    if (orderType !== ROUTE_TEXT) return operations;
    return !operations[index].length ? [operations[index]] : operations[index]
  }

  mountEquipmentsResponse(equipments, orderType) {
    return {
      equipments,
    };
  }
};
