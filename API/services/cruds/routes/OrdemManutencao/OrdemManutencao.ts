const { Router } = require("express");
import RegisterOrderMaintenanceValidate from '../../controller/OrderMaintenance/RegisterOrderMaintenanceValidate'
import GetOrderMaintenanceValidate from '../../controller/OrderMaintenance/getOrdemMaintenanceValidate'
import Auth from '../../../../shared/auth/auth'

const router = Router();
const registerOrderMaintenance = new RegisterOrderMaintenanceValidate();
const getOrderMaintenance = new GetOrderMaintenanceValidate();
const jwt = new Auth();

/** 
 *  ROTA DE CADASTRO DE ORDEM DE MANUTENÇÃO
 * */ 

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
 *  ROTA DE LISTAGEM DE ORDEM DE MANUTENÇÃO
 * */ 

router.get('/', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await getOrderMaintenance.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

module.exports = router;