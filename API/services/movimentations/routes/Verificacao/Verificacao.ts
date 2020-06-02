const { Router } = require("express");
import RegisterVerificationValidate from '../../controller/Verification/registerVericationValidate'
import GetVerificationStatusValidate from '../../controller/Verification/getVerificationStatusValidate'
import Auth from '../../../../shared/auth/auth'

const router = Router();
const registerVerification = new RegisterVerificationValidate();
const getVerificationStatusValidate = new GetVerificationStatusValidate();

const jwt = new Auth();

/** 
 *  ROTA DE REGISTRO DE VERIFICAÇÃO
 * */ 

router.post('/', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await registerVerification.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

router.get('/list-verification', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await getVerificationStatusValidate.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

module.exports = router;
