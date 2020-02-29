const { Router } = require("express");
import RegisterEquipmentValidate from '../../controller/Equipment/registerEquipmentValidate'
import GetEquipmentValidate from '../../controller/Equipment/getEquipmentValidate'
import DeleteEquipmentValidate from '../../controller/Equipment/deleteEquipmentValidate'
import UpdateEquipmentValidate from '../../controller/Equipment/updateEquipmentValidate'
import Auth from '../../auth/auth'

const router = Router();
const registerEquipment = new RegisterEquipmentValidate();
const getEquipment = new GetEquipmentValidate();
const deleteEquipment = new DeleteEquipmentValidate();
const updateEquipment = new UpdateEquipmentValidate();
const jwt = new Auth();

/** 
 *  ROTA DE CADASTRO DE EQUIPAMENTO
 * */ 

router.post('/', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await registerEquipment.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

router.get('/get', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await getEquipment.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

router.delete('/:id', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await deleteEquipment.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

router.put('/:id', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await updateEquipment.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});


module.exports = router;
