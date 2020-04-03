const axios = require('axios');

const API_URL = 'http://localhost:3000';

module.exports = class GetUserAutentication {
  async validateSession({ token }) {
    try {
      if (!token) throw 'nenhum token informado!';
      
      const response = await axios({
        method: 'post',
        url: `${API_URL}/users/token`,
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
      });

      const { data, status } = response;
      
      if (!data || status !== 200) throw 'could not authorize!';
      return { ...data, status };
    } catch (err) {
      throw err;
    }
  }
};
