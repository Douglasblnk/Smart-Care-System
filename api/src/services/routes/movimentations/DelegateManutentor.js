const Router = require('express');
const errorResponseTreatment = require('../../../shared/utils/utils');

const router = Router();

const RegisterUpdateDelegateManutentor = require('../../session/movimentations/delegate/RegisterUpdateDelegateManutentor');

router.post('/', async (req, res, next) => {
  try {
    const response = await new RegisterUpdateDelegateManutentor().run(req);
    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    res.status(responseError.status).send(responseError);
  }
});
router.put('/:id', async (req, res, next) => {
  try {
    const response = await new RegisterUpdateDelegateManutentor().run(req, 'update');
    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});
  
module.exports = router;
