import { errorResponseTreatment } from '../../../shared/utils/utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const RateLimit = require('express-rate-limit');

import Router = require('express');
const router = Router();

import LoginValidate from '../session/user/LoginValidate';
import GetUsers from '../session/user/GetUsers';
import RegisterUpdateUser from '../session/user/RegisterUpdateUser';
import DeleteUser from '../session/user/DeleteUser';


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
router.post('/', createAccountLimiter, async (req: any, res: any) => {
  try {
    const response : any = await new LoginValidate().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA DE REGISTRO DE USUÁRIO
 */
router.post('/register', async (req: any, res: any) => {
  try {
    const response = await new RegisterUpdateUser().run(req);
    
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA DELETAR USUÁRIO
 */
router.delete('/:id', async (req: any, res: any) => {
  try {
    const response = await new DeleteUser().run(req);
    
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);
    
    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA BUSCAR USUÁRIOS CADASTRADOS NO SISTEMA
 */
router.get('/', async (req: any, res: any) => {
  try {
    const response : any = await new GetUsers().run(req);

    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);

    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA DE VALIDAÇÃO DE TOKEN
 */
router.get('/token', async (req: any, res: any) => {
  try {
    res.status(200).send({ authorized: true, user: req.authData });
  } catch (err) {
    const responseError = errorResponseTreatment(err);

    res.status(responseError.status).send(responseError);
  }
});

/**
 *  ROTA PARA ATUALIZAR O USUARIO
 */
router.put('/:id', async (req: any, res: any) => {
  try {
    const response = await new RegisterUpdateUser().run(req, 'update');
    
    res.status(200).send(response);
  } catch (err) {
    const responseError = errorResponseTreatment(err);

    res.status(responseError.status).send(responseError);
  }
});

export default router;
