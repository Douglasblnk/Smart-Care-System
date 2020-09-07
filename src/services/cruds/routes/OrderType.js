const errorResponseTreatment = require('../../../shared/utils/utils');

const Router = require('express');
const router = Router();

const GetOrderType = require('../session/orderType/GetOrderType');


/**
 *  ROTA PARA BUSCAR OS TIPOS DE MANUTENÇÃO
*/
router.get('/', async (req, res, next) => {
  try {
    const response = await new GetOrderType().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

module.exports = router;
