const errorResponseTreatment = require('../../../shared/utils/utils');

const Router = require('express');
const router = Router();

const GetSymptom = require('../../session/cruds/symptom/GetSymptom');
const RegisterUpdateSymptom = require('../../session/cruds/symptom/RegisterUpdateSymptom');
const DeleteSymptom = require('../../session/cruds/symptom/DeleteSymptom');


/**
 *  ROTA DE REGISTRO DE SINTOMA
 */
router.post('/', async (req, res, next) => {
  try {
    const response = await new RegisterUpdateSymptom().run(req);
    
    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA DELETAR SINTOMA
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const response = await new DeleteSymptom().run(req);
    
    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA BUSCAR SINTOMAS CADASTRADOS NO SISTEMA
 */
router.get('/', async (req, res, next) => {
  try {
    const response = await new GetSymptom().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);

    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA ATUALIZAR O SINTOMA
 */
router.put('/:id', async (req, res, next) => {
  try {
    const response = await new RegisterUpdateSymptom().run(req, 'update');
    
    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);

    res.status(responseError.status).send(responseError);
  }
});

module.exports = router;
