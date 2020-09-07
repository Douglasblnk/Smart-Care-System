const errorResponseTreatment = require('../../../../shared/utils/utils');

const Router = require('express');
const router = Router();

const GetCause = require('../../session/cause/GetCause');
const RegisterUpdateCause = require('../../session/cause/RegisterUpdateCause');
const DeleteCause = require('../../session/cause/DeleteCause');

router.post('/', async (req, res, next) => {
  try {
    const response = await new RegisterUpdateCause().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const response = await new GetCause().run(req);

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

router.put('/:id', async (req, res, next) => {
  try {
    const response = await new RegisterUpdateCause().run(req, 'update');

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

module.exports = router;
