const { Router } = require("express");
import RegisterSintomaValidate from '../../controller/Sintoma/registerSintomaValidate'
import GetSintomaValidate from '../../controller/Sintoma/getSintomaValidate'
import DeleteSintomaValidate from '../../controller/Sintoma/deleteSintomaValidate'
import UpdateSintomaValidate from '../../controller/Sintoma/updateSintomavalidate'
import Auth from '../../auth/auth'

const router = Router();
const registerSymptom = new RegisterSintomaValidate()
const getSymptom = new GetSintomaValidate()
const deleteSymptom = new DeleteSintomaValidate()
const updateSymptom = new UpdateSintomaValidate()
const jwt = new Auth();

/** 
 *  ROTA DE CADASTRO DE SINTOMA
 * */ 

router.post('/', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await registerSymptom.run(req);
    
    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);
    
    res.status(404).send(err);
  }
});

router.get('/', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await getSymptom.run(req);
    
    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);
    
    res.status(404).send(err);
  }
});

router.delete('/:id', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await deleteSymptom.run(req);
    
    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);
    
    res.status(404).send(err);
  }
});

router.put('/:id', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await updateSymptom.run(req);
    
    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);
    
    res.status(404).send(err);
  }
});

module.exports = router;