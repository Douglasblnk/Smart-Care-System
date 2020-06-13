import { errorResponseTreatment } from '../../../../shared/utils/utils';

import Router = require('express');
const router = Router();

import GetMaintenanceOrder from '../../session/maintenanceOrder/GetMaintenanceOrder';

/**
 *  ROTA PARA BUSCAR UM RESUMO DE TODAS AS ORDENS DE MANUTENÇÃO
 */
router.get('/', async (req: any, res: any) => {
  try {
    const response : any = await new GetMaintenanceOrder().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});


export default router;
