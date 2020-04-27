const { Router } = require("express");
import RegisterCentroTrabalhoValidate from '../../controller/CentroTrabalho/registerCentroTrabalhoValidate'
import GetCentroTrabalhoValidate from '../../controller/CentroTrabalho/getCentroTrabalho'
import DeleteCentroTrabalhoValidate from '../../controller/CentroTrabalho/deleteCentroTrabalho'
import UpdateCentroTrabalhoValidate from '../../controller/CentroTrabalho/updateCentroTrabalho'
import Auth from '../../shared/auth/auth'

const router = Router();
const registerCentroTrabalho = new RegisterCentroTrabalhoValidate();
const getCentroTrabalho = new GetCentroTrabalhoValidate();
const deleteCentroTrabalho = new DeleteCentroTrabalhoValidate();
const updateCentroTrabalho = new UpdateCentroTrabalhoValidate();
const jwt = new Auth();

/** 
 *  ROTA DE CADASTRO DE CENTRO DE TRABALHO
 * */ 

router.post('/', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await registerCentroTrabalho.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

/** 
 *  ROTA PARA LISTAR CENTRO DE TRABALHO
 * */ 

router.get('/get', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await getCentroTrabalho.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

/** 
 *  ROTA PARA DELETAR CENTRO DE TRABALHO
 * */ 

router.delete('/:id', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await deleteCentroTrabalho.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

/** 
 *  ROTA PARA ALTERAR CENTRO DE TRABALHO
 * */ 

router.put('/:id', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await updateCentroTrabalho.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

module.exports = router;