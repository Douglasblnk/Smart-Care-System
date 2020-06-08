import { errorResponseTreatment } from '../../../shared/utils/utils';

import Router = require('express');
const router = Router();

import GetStatus from '../session/status/getStatus';

/**
 *  ROTA PARA BUSCAR OS STATUS
 */
router.get('/', async (req: any, res: any) => {
  try {
    const response : any = await new GetStatus().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

export default router;
