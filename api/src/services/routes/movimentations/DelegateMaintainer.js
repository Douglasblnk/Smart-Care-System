const Router = require('express');

const router = Router();

const DelegateMaintainer = require('../../session/movimentations/delegate/DelegateMaintainer');
const { errorResponseTreatment } = require('../../../shared/utils/utils');

router.post('/', async (req, res, next) => {
  try {
    const response = await new DelegateMaintainer().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);

    res.status(responseError.status).send(responseError);
  }
});

module.exports = router;
