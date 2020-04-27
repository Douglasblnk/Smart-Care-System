const { Router } = require("express");
import GetPriorityValidate from '../../controller/Priority/getPriorityValidate'
import Auth from '../../shared/auth/auth'

const router = Router();
const getPriorityValidate = new GetPriorityValidate();
const jwt = new Auth();

/** 
 *  ROTA DE CONSULTA DE PRIORIDADE
 * */ 

router.get('/get', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await getPriorityValidate.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

module.exports = router;