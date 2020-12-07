const Router = require('express');

const router = Router();

const { errorResponseTreatment } = require('../../../shared/utils/utils');
const RegisterAppointment = require('../../session/movimentations/appointments/RegisterAppointment');

router.post('/', async (req, res, next) => {
  try {
    const response = await new RegisterAppointment().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);

    res.status(responseError.status).send(responseError);
  }
});

module.exports = router;
