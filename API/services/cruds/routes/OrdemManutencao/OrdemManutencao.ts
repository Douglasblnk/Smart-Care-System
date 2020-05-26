const { Router } = require("express");
import RegisterOrderMaintenanceValidate from '../../controller/OrderMaintenance/RegisterOrderMaintenanceValidate'
import RegisterOrderMaintenanceRouteValidate from '../../controller/OrderMaintenance/RegisterOrderMaintenceRouteValidate'
import RegisterOrderMaintenanceListValidate from '../../controller/OrderMaintenance/RegisterOrderMaintenceListValidate'
import GetOrderMaintenanceSummaryValidate from '../../controller/OrderMaintenance/getOrderMaintenanceSummaryValidate'
import GetOrderMaintenanceDetailValidate from '../../controller/OrderMaintenance/getOrderMaintenanceDetailValidate'
import Auth from '../../../../shared/auth/auth'

const router = Router();
const registerOrderMaintenance = new RegisterOrderMaintenanceValidate();
const registerOrderMaintenanceRoute = new RegisterOrderMaintenanceRouteValidate();
const registerOrderMaintenanceListValidate = new RegisterOrderMaintenanceListValidate();
const getOrderMaintenanceSummary = new GetOrderMaintenanceSummaryValidate();
const getOrderMaintenanceDetail = new GetOrderMaintenanceDetailValidate();
const jwt = new Auth();

/** 
 *  ROTA DE CADASTRO DE ORDEM DE MANUTENÇÃO DO TIPO CORRETIVA
 **/ 
router.post('/', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await registerOrderMaintenance.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

/** 
 *  ROTA DE LISTAGEM RESUMIDA DAS ORDENS DE MANUTENÇÃO DO TIPO CORRETIVA
 */ 
router.get('/summary', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await getOrderMaintenanceSummary.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});


/**
 * ROTA DE DETALHAMENTO DA ORDEM DE MANUTENÇÃO DO TIPO CORRETIVA
 */
router.post('/detail', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await getOrderMaintenanceDetail.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});



router.post('/route', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await registerOrderMaintenanceRoute.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

router.post('/list', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await registerOrderMaintenanceListValidate.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

module.exports = router;

// todo refatorar endpoints de ordem, cada tipo de ordem deve ter um arquivo separado para os endpoints