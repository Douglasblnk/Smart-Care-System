import { errorResponseTreatment } from '../../../../shared/utils/utils';

import Router = require('express');
const router = Router();

import GetAccessLevel from '../../session/accessLevel/GetAccessLevel';

/**
 *  ROTA PARA BUSCAR OS NIVEIS DE ACESSO
 */
router.get('/', async (req: any, res: any) => {
  try {
    const response : any = await new GetAccessLevel().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

export default router;
