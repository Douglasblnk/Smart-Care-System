const { Router } = require("express");
import GetStatsValidate from '../../controller/Stats/getStatsValidate'
import Auth from '../../auth/auth'

const router = Router();
const getStatsValidate = new GetStatsValidate();
const jwt = new Auth();

/** 
 *  ROTA DE CONSULTA DE STATUS
 * */ 

router.get('/get', async (req: any, res: any) => {
  try {
    console.log("Status ponto 1")
    await jwt.jwtVerify(req)
    const response = await getStatsValidate.run(req);
    
    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);
    res.status(404).send(err);
  }
});

module.exports = router;