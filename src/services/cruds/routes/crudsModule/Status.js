const { errorResponseTreatment } = require('../../../../shared/utils/utils');

const Router = require('express');
const router = Router();

const GetStatus = require('../../session/status/getStatus');

/**
 *  ROTA PARA BUSCAR OS STATUS
 */
router.get('/', async (req, res) => {
  try {
    const response = await new GetStatus().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

module.exports = router;
