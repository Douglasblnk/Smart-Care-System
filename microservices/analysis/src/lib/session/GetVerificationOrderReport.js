const GetUserAutentication = require('../integration/getUserAuthentication.js');
const GetVerificationOrderDataReport = require('../datasource/getVerificationOrderDataReport');


module.exports = class GetVerificationOrderReport {
  constructor({
    user = '',
    auth,
  } = {}) {
    this._user = user;
    this._auth = auth;

    this._integrationAuthJwt = new GetUserAutentication();
    this._getVerificationOrderDataReport = new GetVerificationOrderDataReport();

    this._checkParameters();
  }


  async run() {
    try {
      await this._validateSession();
      
      const verifications = await this._getVerificationOrder();

      this._getVerificationOrderDataReport.closeConnection();

      return verifications;
    } catch (err) {
      throw err;
    }
  }

  async _getVerificationOrder() {
    try {
      const verifications = await
      this._getVerificationOrderDataReport.GetVerificationOrderDataReport(this._user);
      
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
