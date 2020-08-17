const { errorResponseTreatment } = require('../../../../shared/utils/utils');

const Router = require('express');
const router = Router();

const GetAccessLevel = require('../../session/accessLevel/GetAccessLevel');

/**
 *  ROTA PARA BUSCAR OS NIVEIS DE ACESSO
 */
router.get('/', async (req, res) => {
  try {
    const response = await new GetAccessLevel().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

module.exports = router;
