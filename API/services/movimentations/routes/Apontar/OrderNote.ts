const { Router } = require("express");
import RegisterOrderNoteValidate from '../../controller/OrderNote/registerOrderNoteValidate'
import Auth from '../../../../shared/auth/auth'

const router = Router();
const registerOrderNoteValidate = new RegisterOrderNoteValidate();

const jwt = new Auth();

/** 
 *  ROTA DE REGISTRO DE APONTAMENTO
 * */ 

router.post('/', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await registerOrderNoteValidate.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

module.exports = router;
