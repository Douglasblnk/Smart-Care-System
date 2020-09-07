const errorResponseTreatment = require('../../../shared/utils/utils');

const Router = require('express');
const router = Router();

const GetOperation = require('../session/operation/GetOperation');
const RegisterUpdateOperation = require('../session/operation/RegisterUpdateOperation');
const DeleteCause = require('../session/operation/DeleteCause');

router.get('/', async (req, res, next) => {
  try {
    const response = await new GetOperation().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const response = await new RegisterUpdateOperation().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const response = await new RegisterUpdateOperation().run(req, 'update');

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const response = await new DeleteCause().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

module.exports = router;
