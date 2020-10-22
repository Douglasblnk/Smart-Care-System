const GetUserAutentication = require('../integration/getUserAuthentication.js');
const GetVerificationOrderDataRequester = require('../datasource/getVerificationOrderDataRequester');


module.exports = class GetVerificationOrderRequester {
  constructor({
    user = '',
    auth,
  } = {}) {
    this._user = user;
    this._auth = auth;

    this._integrationAuthJwt = new GetUserAutentication();
    this._getVerificationOrderDataRequester = new GetVerificationOrderDataRequester();

    this._checkParameters();
  }


  async run() {
    try {
      await this._validateSession();
      
      const verifications = await this._getVerificationOrder();

      this._getVerificationOrderDataRequester.closeConnection();

      return verifications;
    } catch (err) {
      throw err;
    }
  }

  async _getVerificationOrder() {
    try {
      const verifications = await
      this._getVerificationOrderDataRequester.GetVerificationOrderDataRequester(this._user);
      
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
