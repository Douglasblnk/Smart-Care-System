const { Router } = require("express");
import RegisterComponent from '../../controller/registerComponent/registerComponent';
import GetComponentValidate from '../../controller/registerComponent/getComponentValidate';
import  DeleteComponentValidate  from '../../controller/registerComponent/deleteComponentValidate';
import Auth from '../../auth/auth';
import UpdateComponentValidate from '../../controller/registerComponent/updateComponentValidate';

const router = Router();
const registerComponent = new RegisterComponent();
const getComponentValidate = new GetComponentValidate();
const deleteComponentValidate = new DeleteComponentValidate();
const jwt = new Auth();

/** 
 *  ROTA DE CADASTRO DE COMPONENTE
 * */ 

router.post('/', async (req: any, res: any) => {
  try {
    console.log("aqui estoar")
    await jwt.jwtVerify(req)
    const response = await registerComponent.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});
router.get('/get' , async(req: any, res: any) => {
  try {
    console.log("aqui estou")
    await jwt.jwtVerify(req)
    const response = await getComponentValidate.run(req);
    res.status(200).send(response);
  } catch(err){

    res.status(404).send(err);

  }
});
router.delete('/:id', async(req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await deleteComponentValidate.run(req);
    res.status(200).send(response);
  } catch(err){
    res.status(404).send(err);
  }
})
router.put('/:id', async(req: any, res: any) => {
  try {
    await jwt.jwtVerify(req);
    
    const response = await UpdateComponentValidate.arguments(req);
    res.status(200).send(response);
  

  } catch(err) {
    res.status(404).end(err);
  }
})

module.exports = router;