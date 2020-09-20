const GetUserAutentication = require('../integration/getUserAuthentication.js');
const GetVerificationOrderData = require('../datasource/getVerificationOrderData');


module.exports = class GetVerificationOrder {
  constructor({
    auth,
  } = {}) {
    this._auth = auth;

    this._integrationAuthJwt = new GetUserAutentication();
    this._getVerificationOrderData = new GetVerificationOrderData();

    this._checkParameters();
  }


  async run() {
    try {
      await this._validateSession();
      
      const verifications = await this._getVerificationOrder();

      this._getVerificationOrderData.closeConnection();

      return verifications;
    } catch (err) {
      throw err;
    }
  }

  async _getVerificationOrder() {
    try {
      const verifications = await this._getVerificationOrderData.getVerificationOrderData();
      
      if (!verifications) throw 'could not find verifications';

      return verifications;
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
