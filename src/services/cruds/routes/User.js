const errorResponseTreatment = require('../../../shared/utils/utils');

const RateLimit = require('express-rate-limit');

const Router = require('express');
const router = Router();

const LoginValidate = require('../session/user/LoginValidate');
const GetUsers = require('../session/user/GetUsers');
const RegisterUpdateUser = require('../session/user/RegisterUpdateUser');
const DeleteUser = require('../session/user/DeleteUser');

/**
 * Limita a quantidade de tentativas de login
 */
const createAccountLimiter = new RateLimit({
  windowMs: 20*100*100, // 3,3 minutos ou 200 segundos
  max: 10, // Bloqueia após x tentativas
  message: 'Excesso de tentativas, por favor tente novamente em uma hora.',
});

/**
 *  ROTA DE VALIDAÇÃO DE LOGIN
 */
router.post('/', createAccountLimiter, async (req, res, next) => {
  try {
    const response = await new LoginValidate().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA DE REGISTRO DE USUÁRIO
 */
router.post('/register', async (req, res, next) => {
  try {
    const response = await new RegisterUpdateUser().run(req);
    
    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA DELETAR USUÁRIO
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const response = await new DeleteUser().run(req);
    
    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA BUSCAR USUÁRIOS CADASTRADOS NO SISTEMA
 */
router.get('/', async (req, res, next) => {
  try {
    const response = await new GetUsers().run(req);

    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);

    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA DE VALIDAÇÃO DE TOKEN
 */
router.get('/token', async (req, res, next) => {
  try {
    next();
    res.status(200).send({ authorized: true, user: req.authData });
  } catch (err) {
    const responseError = errorResponseTreatment(err);

    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA ATUALIZAR O USUARIO
 */
router.put('/:id', async (req, res, next) => {
  try {
    const response = await new RegisterUpdateUser().run(req, 'update');
    
    next();
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);

    res.status(responseError.status).send(responseError);
  }
});

module.exports = router;
