const errorResponseTreatment = require('../../../shared/utils/utils');

const Router = require('express');
const router = Router();

const GetPriority = require('../../session/cruds/priority/GetPriority');

/**
 *  ROTA PARA BUSCAR AS PRIORIDADES
*/
router.get('/', async (req, res, next) => {
  try {
    const response = await new GetPriority().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

module.exports = router;
