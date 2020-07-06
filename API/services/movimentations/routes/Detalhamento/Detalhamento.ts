const { Router } = require("express");
import ListUserDetail from "../../controller/DetalharOs/listUserDetail";
import ListReportRequester from "../../controller/DetalharOs/getReportRequester";
import RegisterDetalharOS from "../../controller/DetalharOs/registerDetalharOS";
import UpdateDetalheUser from "../../controller/DetalharOs/updateDetalheUser";
import GetUserGeral from "../../controller/DetalharOs/getUserGeral";
import Auth from "../../../../shared/auth/auth";

const router = Router();
const listaUserOs = new ListUserDetail();
const listReportRequester = new ListReportRequester();
const register = new RegisterDetalharOS();
const update = new UpdateDetalheUser();
const getusergeral = new GetUserGeral();
const jwt = new Auth();

router.post("/", async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req);

    const response = await listaUserOs.run(req);

    console.log(response);
    res.status(200).send(response);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.post("/get-report-requester", async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req);

    const response = await listReportRequester.run(req);

    console.log(response);
    res.status(200).send(response);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.post("/register", async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req);

    const response = await register.run(req);

    res.status(200).send(response);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.post("/get-geral-user", async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req);

    const response = await getusergeral.run(req);

    res.status(200).send(response);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.put("/:id", async (req: any, res: any) => {
  try {
    console.log("chegou a requisição update");
    await jwt.jwtVerify(req);
    const response = await update.run(req);

    res.status(200).send(response);
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
