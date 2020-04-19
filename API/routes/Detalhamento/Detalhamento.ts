const { Router } = require("express");
import ListUserDetail from '../../controller/DetalharOs/listUserDetail';
import RegisterDetalharOS from '../../controller/DetalharOs/registerDetalharOS';
import UpdateDetalheUser from '../../controller/DetalharOs/updateDetalheUser';
import GetUserGeral from '../../controller/DetalharOs/getUserGeral';
import Auth from '../../auth/auth';



const router = Router();
const listaUserOs = new ListUserDetail();
const register = new RegisterDetalharOS();
const update = new UpdateDetalheUser();
const getusergeral = new GetUserGeral();
const jwt = new Auth();


router.post('/', async (req: any, res: any) => {
    try {
        
        await jwt.jwtVerify(req);

        const response = await listaUserOs.run(req);
        console.log('hahahah meHAHAHAHAHA');
        console.log(response);
        res.status(200).send(response);

    } catch(err) {
        console.log('XIAXA');
        console.log(err.length);
        res.status(404).send(err);
    }
})
router.post('/register', async (req: any, res: any) => {
    try {
        await jwt.jwtVerify(req);
        
        const response = await register.run(req);

        res.status(200).send(response);

    } catch(err) {
        res.status(404).send(err);
    }
})
router.post('/getgeraluser', async (req: any, res: any) => {
    try {
        await jwt.jwtVerify(req);

        const response = await getusergeral.run(req);

        res.status(200).send(response);

    } catch(err) {
        res.status(404).send(err);
    }
})
router.put('/:id', async (req: any, res: any) => {
    try {
        console.log('SO se gA')
        await jwt.jwtVerify(req);
        const response = await update.run(req);

        res.status(200).send(response)

    } catch(err) {
        res.status(404).send(err);
    }
})
module.exports = router;