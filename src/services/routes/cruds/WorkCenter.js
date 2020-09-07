const errorResponseTreatment = require('../../../shared/utils/utils');

const Router = require('express');
const router = Router();

const RegisterUpdateWorkCenter = require('../../session/cruds/workCenter/RegisterUpdateWorkCenter');
const GetWorkCenter = require('../../session/cruds/workCenter/GetWorkCenter');
const DeleteWorkCenter = require('../../session/cruds/workCenter/DeleteWorkCenter');


router.post('/', async (req, res, next) => {
  try {
    const response = await new RegisterUpdateWorkCenter().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const response = await new GetWorkCenter().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const response = await new DeleteWorkCenter().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const response = await new RegisterUpdateWorkCenter().run(req, 'update');

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

module.exports = router;
