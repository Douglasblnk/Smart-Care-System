const { Router } = require("express");
import RegisterCauseValidate from '../../controller/Causa/registerCausaValidate'
import GetCauseValidate from '../../controller/Causa/getCausaValidate'
import DeleteCauseValidate from '../../controller/Causa/deleteCausaValidate'
import UpdateCauseValidate from '../../controller/Causa/updateCausaValidate'
import Auth from '../../shared/auth/auth'

const router = Router();
const registerCause = new RegisterCauseValidate()
const getCause = new GetCauseValidate()
const deleteCause = new DeleteCauseValidate()
const updateCause = new UpdateCauseValidate()
const jwt = new Auth();

/** 
 *  ROTA DE CADASTRO DE CAUSA
 * */ 

router.post('/', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await registerCause.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

router.get('/', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await getCause.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

router.delete('/:id', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await deleteCause.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

router.put('/:id', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await updateCause.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

module.exports = router;