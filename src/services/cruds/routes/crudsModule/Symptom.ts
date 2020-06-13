import { errorResponseTreatment } from '../../../../shared/utils/utils';

import Router = require('express');
const router = Router();

import GetSymptom from '../../session/symptom/GetSymptom';
import RegisterUpdateSymptom from '../../session/symptom/RegisterUpdateSymptom';
import DeleteSymptom from '../../session/symptom/DeleteSymptom';


/**
 *  ROTA DE REGISTRO DE SINTOMA
 */
router.post('/', async (req: any, res: any) => {
  try {
    const response = await new RegisterUpdateSymptom().run(req);
    
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA DELETAR SINTOMA
 */
router.delete('/:id', async (req: any, res: any) => {
  try {
    const response = await new DeleteSymptom().run(req);
    
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA BUSCAR SINTOMAS CADASTRADOS NO SISTEMA
 */
router.get('/', async (req: any, res: any) => {
  try {
    const response : any = await new GetSymptom().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);

    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA ATUALIZAR O SINTOMA
 */
router.put('/:id', async (req: any, res: any) => {
  try {
    const response = await new RegisterUpdateSymptom().run(req, 'update');
    
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);

    res.status(responseError.status).send(responseError);
  }
});

export default router;
