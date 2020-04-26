const { Router } = require("express");

import GetAccessLevel from '../../controller/AccessLevel/getAccessLevelController'
import Auth from '../../auth/auth'

const router = Router();
const getAccessLevel = new GetAccessLevel();
const jwt = new Auth();


/** 
 *  ROTA PARA PEGAR TODOS OS NÍVEIS DE ACESSO
 * */ 

router.get('/get', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)

    const response : any = await getAccessLevel.run(req);
    
    console.log('response => ', response);
    
    res.status(200).send(response);
  } catch (err) {
    console.log('err nivelAcesso =>', err);

    res.status(404).send(err);
  }
});

module.exports = router;
