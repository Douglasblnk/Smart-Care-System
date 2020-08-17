const { errorResponseTreatment } = require('../../../../shared/utils/utils');

const Router = require('express');
const router = Router();

const GetMaintenanceOrder = require('../../session/maintenanceOrder/GetMaintenanceOrder');
const DeleteMaintenanceOrder = require('../../session/maintenanceOrder/DeleteMaintenanceOrder');
const RegisterMaintenanceOrder = require('../../session/maintenanceOrder/RegisterCorrectiveOrder');

/**
 *  ROTA PARA BUSCAR UM RESUMO DE TODAS AS ORDENS DE MANUTENÇÃO
 */
router.get('/', async (req, res) => {
  try {
    const response = await new GetMaintenanceOrder().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA CADASTRAR UMA 0RDEM DE MANUTENÇÃO DO TIPO CORRETIVA
 */
router.post('/', async (req, res) => {
  try {
    const response = await new RegisterMaintenanceOrder().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA DELETAR UMA ORDEM DO SISTEMA
 */
router.delete('/:id', async (req, res) => {
  try {
    const response = await new DeleteMaintenanceOrder().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});


module.exports = router;
