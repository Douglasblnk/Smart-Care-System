const { Router } = require("express");
import RegisterVerificationValidate from '../../controller/Verification/registerVericationValidate'
import Auth from '../../auth/auth'

const router = Router();
const registerVerification = new RegisterVerificationValidate();

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

module.exports = router;
