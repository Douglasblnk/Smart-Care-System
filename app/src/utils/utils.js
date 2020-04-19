const Vuex = require('../store/index');
const Axios = require('axios');

const getLocalStorageToken = () => localStorage.getItem('token');

const validateToken = () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) throw 'no token found';
  } catch (err) {
    throw err;
  }
};

const validateSession = async apiUrl => {
  try {
    const response = await Axios({
      method: 'post',
      url: `${apiUrl}/users/token`,
      headers: {
        'authorization': `Bearer ${getLocalStorageToken()}`,
      },
    });
    
    if (response.status !== 200) throw response;

    if (response.data.authorized) {
      Vuex.default.commit('addUser', {
        email: response.data.user.email,
        nome: response.data.user.nome,
        nivelAcesso: response.data.user.nivelAcesso,
        funcao: response.data.user.funcao,
        cracha: response.data.user.numeroCracha,
      });

      return 'Autenticado!';
    }

    throw response;
  } catch (err) {
    console.log('err validateSesion => :', err);
    throw err;
  }
};

const getErrors = err => {
  let error = 'Ops! Não foi possível concluir a operação, tente novamente mais tarde.';

  if (!err) return error;
  else error = err;
  

  if (!err.response) return error;
  else error = err.response;
  

  if (err.response.result) {
    error = err.response.result;
  } else if (err.response.data) {
    error = err.response.data;
  }
  
  if (!err.response.data) return error;
    
  if (err.response.data.err) {
    error = err.response.data.err;
  } else if (err.response.data.result) {
    error = err.response.data.result;
  } else if (err.response.data.message || err.response.data.msg) {
    error = err.response.data.msg || err.response.data.message;
  }

  if (err.response.data.name === 'TokenExpiredError')
    return error.concat(' Sessão expirada.');
    
  return error;
};

module.exports = {
  getLocalStorageToken,
  validateToken,
  validateSession,
  getErrors,
};
