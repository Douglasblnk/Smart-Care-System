const axios = require('axios');

const API_URL = 'http://localhost:3000/';

module.exports = class GetUserAutentication {
  validateSession({ token }) {
    try {
      if (!token) throw 'nenhum token informado!';
      
      console.log(axios);
      axios({
        method: 'post',
        url: `${API_URL}/users/token`,
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
      }).then(res => console.log('res :', res))
        .catch(err => console.log('err :', err));
    } catch (err) {
      throw err;
    }
  }
};
