import Vuex from '../store/index';

export async function validate(apiUrl) {
  try {
    fetch(`${apiUrl}/users/token`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(res => res.json())
      .then(res => {
        if (res.authorized) {
          Vuex.commit('addUser', {
            email: res.user.email,
            nome: res.user.nome,
            nivelAcesso: res.user.nivelAcesso,
            funcao: res.user.funcao,
            cracha: res.user.numeroCracha,
          });

          return 'Autenticado!';
        }
        throw res;
      });
  } catch (err) {
    throw err;
  }
}
