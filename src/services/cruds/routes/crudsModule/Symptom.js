const errorResponseTreatment = require('../../../../shared/utils/utils');

const Router = require('express');
const router = Router();

const GetSymptom = require('../../session/symptom/GetSymptom');
const RegisterUpdateSymptom = require('../../session/symptom/RegisterUpdateSymptom');
const DeleteSymptom = require('../../session/symptom/DeleteSymptom');


/**
 *  ROTA DE REGISTRO DE SINTOMA
 */
router.post('/', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
router.get('/', async (req, res) => {
  try {
    const response = await new GetSymptom().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);

    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA ATUALIZAR O SINTOMA
 */
router.put('/:id', async (req, res) => {
  try {
    const response = await new RegisterUpdateSymptom().run(req, 'update');
    
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);

    res.status(responseError.status).send(responseError);
  }
});

module.exports = router;
