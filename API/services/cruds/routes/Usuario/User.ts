const { Router } = require("express");
import LoginValidate from '../../controller/user/loginValidate'
import RegisterUserValidate from '../../controller/user/registerUserValidate'
import GetUsersValidate from '../../controller/user/getUsersValidate'
import GetUserRequester from '../../controller/user/getUserRequesterValidate'
import GetUserReport from '../../controller/user/getUserReportValidate'
import DeleteUserValidate from '../../controller/user/deleteUserValidate'
import UpdateUserValidate from '../../controller/user/updateUserValidate'
import Auth from '../../../../shared/auth/auth'
import TokenValidate from '../../controller/user/tokenValidate'
const  RateLimit  = require("express-rate-limit");
//import RateLimit from '../../node_modules/express-rate-limit';

const router = Router();
const login = new LoginValidate();
const register = new RegisterUserValidate();
const getUser = new GetUsersValidate();
const getUserRequester = new GetUserRequester();
const getUserReport = new GetUserReport();
const deleteUser = new DeleteUserValidate();
const updateUser = new UpdateUserValidate();
const jwt = new Auth();
const tokenValidate = new TokenValidate();

const createAccountLimiter = new RateLimit({
  windowMs: 20*100*100, // 3,3 minutos ou 200 segundos
  max: 5, // Bloqueia após x tentativas 
  message: "Excesso de tentativas, por favor tente novamente em uma hora."
});

/** 
 *  ROTA DE VALIDAÇÃO DE LOGIN
 * */ 

router.post('/', createAccountLimiter ,  async  (req: any, res: any) => {
  try {
    const response : any = await login.run(req);
    console.log('LOGIN RESPONSE', response);
    
    const token : any = await jwt.jwtToken(response)

    const { result } = response
    delete result.senha;
    
    const loginResponse : any = { ...token, ...result }

    res.status(200).send(loginResponse);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

/** 
 *  ROTA DE REGISTRO DE USUÁRIO
 * */ 
router.post('/register', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    console.log('DEU CERTO');
    const response = await register.run(req);

    // console.log('user response', response);
    
    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

/** 
 *  ROTA PARA DELETAR USUÁRIO
 * */ 

router.delete('/:id', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    console.log('DEU CERTO');
    const response = await deleteUser.run(req);

    // console.log('user response', response);
    
    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

/** 
 *  ROTA PARA PEGAR TODOS OS USUÁRIOS CADASTRADOS
 * */
router.get('/get', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    console.log('DEU CERTO');
    const response : any = await getUser.run(req);
    
    response.result.forEach((user : any) => {
      delete user.senha;
    })
    
    console.log('user response', response);
    
    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

/** 
 *  ROTA PARA PEGAR TODOS OS USUÁRIO DE NÍVEL SOLICITANTE
 * */ 

router.get('/requester', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response : any = await getUserRequester.run(req);
    
    console.log('user response', response);
    
    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

router.get('/report', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    const response : any = await getUserReport.run(req);
    
    console.log('user response', response);
    
    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

/** 
 *  ROTA DE VALIDAÇÃO DE TOKEN
 * */ 

router.post('/token', async (req: any, res: any) => {
  try {
    const response = await jwt.jwtVerify(req);
    console.log('RESPONSE: ', response);
    const user : any = await tokenValidate.run(response);

    delete user.result.senha;

    res.status(200).send({ authorized: true, user: user.result })
  } catch (err) {
    console.log('Deu erro mesmo', err);

    res.status(401).send(err)
  }
})

/** 
 *  ROTA PARA ATUALIZAR O USUARIO
 * */ 

router.put('/:id', async (req: any, res: any) => {
  try {
    await jwt.jwtVerify(req)
    console.log('DEU CERTO');
    const response = await updateUser.run(req);

    console.log('user response', response);
    
    res.status(200).send(response);
  } catch (err) {
    console.log('deu erro mesmo', err);

    res.status(404).send(err);
  }
});

module.exports = router;
