import { errorResponseTreatment } from '../../../../shared/utils/utils';

import Router = require('express');
const router = Router();

import GetInstallationLocation from '../../session/installationLocation/GetInstallationLocation';
//import RegisterUpdateEquipments from '../../session/equipments/RegisterUpdateEquipments';
//import DeleteEquipments from '../../session/equipments/DeleteEquipments';

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
 *  ROTA PARA REGISTRAR UM LOCAIS DE INSTALAÇÃO
*/
router.post('/', async (req: any, res: any) => {
  try {
    //const response : any = await new RegisterUpdateEquipments().run(req);

    //res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA ALTERAR UM LOCAIS DE INSTALAÇÃO
*/
router.put('/:id', async (req: any, res: any) => {
  try {
    //const response : any = await new RegisterUpdateEquipments().run(req, 'update');

    //res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA DELETAR UM LOCAIS DE INSTALAÇÃO
*/
router.delete('/:id', async (req: any, res: any) => {
  try {
    //const response = await new DeleteEquipments().run(req);

    //res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

export default router;
