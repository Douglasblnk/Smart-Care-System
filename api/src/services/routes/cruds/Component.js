const { errorResponseTreatment } = require('../../../shared/utils/utils');

const Router = require('express');
const router = Router();

const GetComponents = require('../../session/cruds/component/GetComponents');
const RegisterUpdateComponent = require('../../session/cruds/component/RegisterUpdateComponent');
const DeleteComponent = require('../../session/cruds/component/DeleteComponent');

router.get('/', async (req, res, next) => {
  try {
    const response = await new GetComponents().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const response = await new RegisterUpdateComponent().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const response = await new RegisterUpdateComponent().run(req, 'update');

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const response = await new DeleteComponent().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

module.exports = router;
