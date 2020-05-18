const { Router } = require("express");

import getOperacoes from '../../controller/Operacoes/getOperacoesValidate';
import RegisterOperacoesValidate from '../../controller/Operacoes/registerOperacoesValidate';
import DeleteOperacoesValidate from '../../controller/Operacoes/deleteOperacoesValidate';
import UpdateOperacoesValidate from '../../controller/Operacoes/updateOperacoesValidate';

import Auth from '../../../../shared/auth/auth'

const operacao = new getOperacoes()
const registerOperacoes = new RegisterOperacoesValidate();
const deleteOperacoes = new DeleteOperacoesValidate();
const updateOperacoes = new UpdateOperacoesValidate();
const router = Router();
const jwt = new Auth();

/** 
 *  ROTA PARA PEGAR TODOS OS NÍVEIS DE ACESSO
 * */ 
router.post('/', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await registerOperacoes.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

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

router.delete('/:id', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await deleteOperacoes.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

router.put('/:id', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await updateOperacoes.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

module.exports = router;
