const { Router } = require("express");

import GetEpiValidate from '../../controller/Epi/getEpiValidate';
import RegisterEpiValidate from '../../controller/Epi/registerEpiValidate';
import UpdateEpiValidate from '../../controller/Epi/updateEpiValidate';
import DeleteEpiValidate from '../../controller/Epi/deleteEpiValidate';
import Auth from '../../auth/auth';

const router = Router();
const getEpiValidate = new GetEpiValidate();
const registerEpiValidate = new RegisterEpiValidate();
const updateEpiValidate = new UpdateEpiValidate();
const deleteEpiValidate = new DeleteEpiValidate();
const jwt = new Auth();

router.post('/', async(req: any, res: any) => {
    try {
        await jwt.jwtVerify(req);
        const response = await registerEpiValidate.run(req);

        res.status(200).send(response);

    }catch(err) {
        res.status(404).send(err);
    }
})
router.get('/get', async(req: any, res: any) => {
    try {
        await jwt.jwtVerify(req);
        const response = await getEpiValidate.run(req);

        res.status(200).send(response);

    } catch(err) {
        res.status(404).send(err);
    }
})
router.delete('/:id', async(req: any, res: any) => {
    try {
        await jwt.jwtVerify(req);
        const response = await deleteEpiValidate.run(req);

        res.status(200).send(response);

    } catch(err) {
        res.status(404).send(err);
    }
})
router.put('/:id', async(req: any, res: any) => {
    try {
        await jwt.jwtVerify(req);

        const response = await updateEpiValidate.run(req);

        res.status(200).send(response);

    } catch(err) {
        res.status(404).send(err);
    }
})

module.exports = router;
