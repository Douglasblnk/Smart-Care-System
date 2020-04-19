import Axios from 'axios';
import Http from './http';

export default class Services extends Http {
  async setActivity(activityId, activity, token) {
    try {
      const response = await Axios({
        method: 'post',
        url: 'http://localhost:3010/activity/set',
        headers: {
          'authorization': `${token}`,
        },
        data: { activityId, activity },
      });

      await this.validateData(response);

      return response.data;
    } catch (err) {
      console.log('err setActivity => :', err);
      this.validateError(err);
      throw err;
    }
  }

  async microserviceAnalisis(url, token) {
    try {
      const response = await Axios({
        method: 'get',
        url: `http://localhost:3020/${url}`,
        headers: {
          'authorization': `${token}`,
        },
      });

      await this.validateData(response);

      return response.data;
    } catch (err) {
      console.log('err analisis => :', err);
      this.validateError(err);
      throw err;
    }
  }
}