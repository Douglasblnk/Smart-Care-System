const errorResponseTreatment = require('../../../shared/utils/utils');

const Router = require('express');
const router = Router();

const RegisterUpdateEpi = require('../../session/cruds/epi/RegisterUpdateEpi');
const GetEpi = require('../../session/cruds/epi/GetEpi');
const DeleteEpi = require('../../session/cruds/epi/DeleteEpi');


router.post('/', async (req, res, next) => {
  try {
    const response = await new RegisterUpdateEpi().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const response = await new GetEpi().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const response = await new DeleteEpi().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const response = await new RegisterUpdateEpi().run(req, 'update');

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

module.exports = router;
