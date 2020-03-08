const { Router } = require("express");
import RegisterComponent from '../../controller/registerComponent/registerComponent'
import GetComponentValidate from '../../controller/registerComponent/getComponentValidate';
import Auth from '../../auth/auth'

const router = Router();
const registerComponent = new RegisterComponent();
const getComponentValidate = new GetComponentValidate();
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
module.exports = router;