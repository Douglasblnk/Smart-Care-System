const Vuex = require('../store/index');
const Axios = require('axios');
const { get } = require('deep-object-js');

const getToken = () => localStorage.getItem('token');

const validateToken = () => {
  try {
    const token = localStorage.getItem('token');

    if (!token) throw 'no token found';
  } catch (err) {
    throw err;
  }
};

const isObjectEmpty = obj => Object.keys(obj).length === 0 && obj.constructor === Object;

const validateSession = async apiUrl => {
  try {
    const response = await Axios({
      method: 'get',
      url: `${apiUrl}/users/token`,
      headers: {
        'authorization': `Bearer ${getToken()}`,
      },
    });
    
    if (response.status !== 200) throw response;

    if (response.data.authorized) {
      Vuex.default.commit('addUser', {
        email: response.data.user.email,
        nome: response.data.user.nome,
        nivelAcesso: response.data.user.nivel_acesso,
        funcao: response.data.user.funcao,
        cracha: response.data.user.numeroCracha,
        userId: response.data.user.idUsuario,
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
  const message = (
    get(err, 'response.data.msg')
    || get(err, 'response.data.message')
    || get(err, 'msg')
    || get(err, 'message')
  );

  const status = (
    get(err, 'response.data.status')
    || get(err, 'response.data.statusCode')
    || get(err, 'status')
    || get(err, 'statusCode')
  );

  console.log('status :>> ', status);
  
  return `
    <div style="margin: 10px; display: flex; flex-direction: column">
      <span class="text-muted">
        Erro: ${message || 'Não foi possível concluir a operação.'}
      </span>
      <small>
        StatusCode: ${status || ''} <br>
      </small>
    </div>
  `;
};

// const getErrors = err => {
//   let error = 'Ops! Não foi possível concluir a operação, tente novamente mais tarde.';

//   if (!err) return error;
//   error = err;
  

//   if (!err.response) return error;
//   error = err.response;
  

//   if (err.response.result) error = err.response.result;
//   else if (err.response.data) error = err.response.data;
  
  
//   if (!err.response.data) return error;
    
//   if (err.response.data.err) error = err.response.data.err;
//   else if (err.response.data.result) error = err.response.data.result;
//   else if (err.response.data.message || err.response.data.msg)
//     error = err.response.data.msg || err.response.data.message;
  

//   if (err.response.data.name === 'TokenExpiredError')
//     return error.concat(' Sessão expirada.');
  
//   if (isObject(error)) {
//     return `
//       <h3>Os seguintes erros foram encontrados:</h3>
//       <p>${Object.values(error).join('; <br>')}</p>
//     `;
//   }

//   return error;
// };

const getAccessLevelName = accessNum => {
  const num = Number.isNaN(accessNum) ? accessNum : String(accessNum);

  if (num === '1') return 'Administrador';
  if (num === '2') return 'Manutentor';
  if (num === '3') return 'Solicitante';
};

const getPriorityClass = priority => {
  if (priority === 'Baixa') return 'low-priority';
  if (priority === 'Média') return 'medium-priority';
  if (priority === 'Alta') return 'high-priority';
  if (priority === 'Muito Alta') return 'very-high-priority';
};

module.exports = {
  getToken,
  validateToken,
  validateSession,
  getErrors,
  getAccessLevelName,
  getPriorityClass,
  isObjectEmpty,
};
