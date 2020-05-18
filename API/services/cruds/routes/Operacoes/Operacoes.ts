const { Router } = require("express");

import getOperacoes from '../../controller/Operacoes/getOperacoesValidate';
import Auth from '../../../../shared/auth/auth'

const operacao = new getOperacoes()
const router = Router();
const jwt = new Auth();

/** 
 *  ROTA PARA PEGAR TODOS OS NÍVEIS DE ACESSO
 * */ 

router.get('/get', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)

    const response : any = await operacao.run();
    
    console.log('response => ', response);
    
    res.status(200).send(response);
  } catch (err) {
    console.log('err operações =>', err);

    res.status(404).send(err);
  }
});

module.exports = router;
