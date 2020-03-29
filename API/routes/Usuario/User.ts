const { Router } = require("express");
import LoginValidate from '../../controller/user/loginValidate'
import RegisterUserValidate from '../../controller/user/registerUserValidate'
import GetUsersValidate from '../../controller/user/getUsersValidate'
import DeleteUserValidate from '../../controller/user/deleteUserValidate'
import UpdateUserValidate from '../../controller/user/updateUserValidate'
import Auth from '../../auth/auth'
const  RateLimit  = require("express-rate-limit");
//import RateLimit from '../../node_modules/express-rate-limit';

const router = Router();
const login = new LoginValidate();
const register = new RegisterUserValidate();
const getUser = new GetUsersValidate();
const deleteUser = new DeleteUserValidate();
const updateUser = new UpdateUserValidate();
const jwt = new Auth();
/*
const apiLimiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes 
  max: 100,
  delayMs: 0 // disabled 
});
*/

const createAccountLimiter = new RateLimit({
  windowMs: 60*60*10, // 1 hour window 
  max: 5, // start blocking after 5 requests 
  message: "Too many accounts created from this IP, please try again after an hour"
  
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

    console.log('user response', response);
    
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

    console.log('user response', response);
    
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
 *  ROTA DE VALIDAÇÃO DE TOKEN
 * */ 

router.post('/token', async (req: any, res: any) => {
  try {
    const response = await jwt.jwtVerify(req)
    const user : any = await login.run(response)

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
