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
  const message = (get(err, 'response.data.msg') || get(err, 'response.data.message'));

  const status = (
    get(err, 'response.data.status')
    || get(err, 'response.data.statusCode')
    || get(err, 'status')
    || get(err, 'statusCode')
  );
  
  return `
    <div style="margin: 10px; display: flex; flex-direction: column">
      <span class="text-muted">
        Erro: ${message || 'Não foi possível concluir a operação.'}
      </span>
      <small class="text-muted">
        StatusCode: ${status || ''} <br>
      </small>
    </div>
  `;
};

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
