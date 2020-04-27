const { Router } = require("express");
import RegisterLocalInstalacaoValidate from '../../controller/localInstalacao/registerLocalInstalacaoValidate'
import GetLocalInstalacaoValidate from '../../controller/localInstalacao/getLocalInstalacaoValidate'
import DeleteLocalInstalacaoValidate from '../../controller/localInstalacao/deleteLocalInstalacaoValidate'
import UpdateLocalInstalacaoValidate from '../../controller/localInstalacao/updateLocalInstalacaoValidate'
import Auth from '../../../../shared/auth/auth'

const router = Router();
const registerLocalInstalacao = new RegisterLocalInstalacaoValidate();
const getLocalInstalacao = new GetLocalInstalacaoValidate();
const deleteLocalInstalacao = new DeleteLocalInstalacaoValidate();
const updateLocalInstalacao = new UpdateLocalInstalacaoValidate();
const jwt = new Auth();

/** 
 *  ROTA DE CADASTRO DE LOCAL INSTALAÇÃO
 * */ 

router.post('/', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await registerLocalInstalacao.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

router.get('/get', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await getLocalInstalacao.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

router.delete('/:id', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await deleteLocalInstalacao.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

router.put('/:id', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await updateLocalInstalacao.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

module.exports = router;