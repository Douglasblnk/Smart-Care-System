const errorResponseTreatment = require('../../../../shared/utils/utils');

const Router = require('express');
const router = Router();

const GetInstallationLocation = require('../../session/installationLocation/GetInstallationLocation');
const DeleteInstallationLocation = require('../../session/installationLocation/DeleteInstallationLocation');
const RegisterUpdateInstallationLocation = require(
  '../../session/installationLocation/RegisterUpdateInstallationLocation',
);

/**
 *  ROTA PARA BUSCAR OS LOCAIS DE INSTALAÇÃO
*/
router.get('/', async (req, res) => {
  try {
    const response = await new GetInstallationLocation().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA REGISTRAR UM LOCAL DE INSTALAÇÃO
*/
router.post('/', async (req, res) => {
  try {
    const response = await new RegisterUpdateInstallationLocation().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA ALTERAR UM LOCAL DE INSTALAÇÃO
*/
router.put('/:id', async (req, res) => {
  try {
    const response = await new RegisterUpdateInstallationLocation().run(req, 'update');

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA DELETAR UM LOCAL DE INSTALAÇÃO
*/
router.delete('/:id', async (req, res) => {
  try {
    const response = await new DeleteInstallationLocation().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

export default router;
