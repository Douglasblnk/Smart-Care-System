const GetUserAutentication = require('../integration/getUserAuthentication.js');
const GetOrderByMonthData = require('../datasource/getOrderLastMonthData');


module.exports = class GetOrderSummary {
  constructor({
    auth,
  } = {}) {
    this._auth = auth;

    this._integrationAuthJwt = new GetUserAutentication();
    this._getOrderByMonth = new GetOrderByMonthData();

    this._checkParameters();
  }


  async run() {
    try {
      await this._validateSession();
      
      const lastMonth = await this._getMonthlyOrder();

      this._getOrderByMonth.closeConnection();

      return lastMonth;
    } catch (err) {
      throw err;
    }
  }

  async _getMonthlyOrder() {
    try {
      const orders = await this._getOrderByMonth.getOrderLastMonth();
      
      if (!orders) throw 'could not find orders';

      return orders;
    } catch (err) {
      throw err;
    }
  }

  async _validateSession() {
    try {
      const res = await this._integrationAuthJwt.validateSession({
        token: this._auth,
      });
      
      if (!res || res.status !== 200) throw 'could not validate session';
    } catch (err) {
      throw err;
    }
  }

  _checkParameters() {
    try {
      if (!this._auth) throw (400, { auth: 'undefined' });
    } catch (err) {
      console.log('err getOrdeSummary => ', err);
      throw err;
    }
  }
};
