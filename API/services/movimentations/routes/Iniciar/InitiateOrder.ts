const { Router } = require("express");

import Auth from "../../../../shared/auth/auth";
import InitiateOrderValidate from '../../controller/Iniciar/InitiateOrderValidate';
import AssumeOrderValidate from '../../controller/Iniciar/assumeOrderValidate';

const router = Router();
const jwt = new Auth();
const initiateOrder = new InitiateOrderValidate();
const assumeOrder = new AssumeOrderValidate();



router.post("/init", async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req);

    const response = await initiateOrder.run(req);

    console.log('response =>', response);
    res.status(200).send(response);
  } catch (err) {
    console.log('err init => :>> ', err);
    res.status(404).send(err);
  }
});

router.post("/assume", async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req);

    const response = await assumeOrder.run(req);

    console.log('response assume => ', response);
    res.status(200).send(response);
  } catch (err) {
    console.log('err assume => :>> ', err);
    res.status(404).send(err);
  }
});



module.exports = router;
