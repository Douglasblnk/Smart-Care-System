const Router = require('express');
const errorResponseTreatment = require('../../../shared/utils/utils');

const router = Router();

const GetMaintenanceOrder = require('../../session/cruds/maintenanceOrder/GetMaintenanceOrder');
const DeleteMaintenanceOrder = require('../../session/cruds/maintenanceOrder/DeleteMaintenanceOrder');
const RegisterMaintenanceOrder = require('../../session/cruds/maintenanceOrder/RegisterMaintenanceOrder');
const GetMaintenanceEquipments = require('../../session/cruds/maintenanceOrder/GetMaintenanceEquipments');

/**
 *  ROTA PARA BUSCAR UM RESUMO DE TODAS AS ORDENS DE MANUTENÇÃO
 */
router.get('/', async (req, res, next) => {
  try {
    const response = await new GetMaintenanceOrder().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA CADASTRAR UMA 0RDEM DE MANUTENÇÃO
 */
router.post('/', async (req, res, next) => {
  try {
    const response = await new RegisterMaintenanceOrder().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA DELETAR UMA ORDEM DO SISTEMA
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const response = await new DeleteMaintenanceOrder().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA BUSCAR OS EQUIPAMENTOS DE UMA ORDEM
 */
router.get('/equipments-operations', async (req, res, next) => {
  try {
    const response = await new GetMaintenanceEquipments().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});


module.exports = router;
