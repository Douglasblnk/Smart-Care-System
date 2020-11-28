const Router = require('express');

const router = Router();

const { errorResponseTreatment } = require('../../../shared/utils/utils');
const AssumeOrder = require('../../session/movimentations/orderSteps/AssumeOrder');

router.post('/assumir', async (req, res, next) => {
  try {
    const response = await new AssumeOrder().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);

    res.status(responseError.status).send(responseError);
  }
});

module.exports = router;
