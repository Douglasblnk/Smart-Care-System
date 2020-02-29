const { Router } = require("express");
import RegisterTipoOrdem from '../../controller/TipoOrdem/registerTipoOrdemValidate'
import GetTipoOrdem from '../../controller/TipoOrdem/getTipoOrdemValidate'
import DeleteTipoOrdem from '../../controller/TipoOrdem/deleteTipoOrdemValidate'
import UpdateTipoOrdem from '../../controller/TipoOrdem/updateTipoOrdemValidate'
import Auth from '../../auth/auth'

const router = Router();
const TipoOrdem = new RegisterTipoOrdem();
const getTipoOrdem = new GetTipoOrdem();
const deleteTipoOrdem = new DeleteTipoOrdem();
const updateTipoOrdem = new UpdateTipoOrdem();
const jwt = new Auth();

/** 
 *  ROTA DE CADASTRO DE TIPO DE ORDEM DE MANUTENÇÃO
 * */ 

router.post('/', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await TipoOrdem.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});


router.get('/get', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await getTipoOrdem.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

router.delete('/:id', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await deleteTipoOrdem.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

router.put('/:id', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response = await updateTipoOrdem.run(req);

    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

module.exports = router;