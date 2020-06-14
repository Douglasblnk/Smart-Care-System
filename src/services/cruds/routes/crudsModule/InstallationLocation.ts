import { errorResponseTreatment } from '../../../../shared/utils/utils';

import Router = require('express');
const router = Router();

import GetInstallationLocation from '../../session/installationLocation/GetInstallationLocation';
import RegisterUpdateInstallationLocation from '../../session/installationLocation/RegisterUpdateInstallationLocation';
import DeleteInstallationLocation from '../../session/installationLocation/DeleteInstallationLocation';

/**
 *  ROTA PARA BUSCAR OS LOCAIS DE INSTALAÇÃO
*/
router.get('/', async (req: any, res: any) => {
  try {
    const response : any = await new GetInstallationLocation().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA REGISTRAR UM LOCAL DE INSTALAÇÃO
*/
router.post('/', async (req: any, res: any) => {
  try {
    const response : any = await new RegisterUpdateInstallationLocation().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA ALTERAR UM LOCAL DE INSTALAÇÃO
*/
router.put('/:id', async (req: any, res: any) => {
  try {
    const response : any = await new RegisterUpdateInstallationLocation().run(req, 'update');

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA DELETAR UM LOCAL DE INSTALAÇÃO
*/
router.delete('/:id', async (req: any, res: any) => {
  try {
    const response = await new DeleteInstallationLocation().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

export default router;
