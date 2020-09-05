const errorResponseTreatment = require('../../../../shared/utils/utils');

const Router = require('express');
const router = Router();

const RegisterUpdateEpi = require('../../session/epi/RegisterUpdateEpi');
const GetEpi = require('../../session/epi/GetEpi');
const DeleteEpi = require('../../session/epi/DeleteEpi');


router.post('/', async (req, res) => {
  try {
    const response = await new RegisterUpdateEpi().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

router.get('/', async (req, res) => {
  try {
    const response = await new GetEpi().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await new DeleteEpi().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const response = await new RegisterUpdateEpi().run(req, 'update');

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

module.exports = router;
