const GetUserAuthentication = require('../integration/GetUserAuthentication');
const SetActivityData = require('../datasource/SetActivityData');

module.exports = class SetActivity {
  constructor({
    auth,
    name,
    badge,
    email,
    date,
    activityId,
    note = '',
  } = {}) {
    this._auth = auth;
    this._name = name;
    this._badge = badge;
    this._email = email;
    this._date = date;
    this._activityId = activityId;
    this._note = note;

    this._checkParameters();

    this._integrationAuthJwt = new GetUserAuthentication();
    this._setActivityData = new SetActivityData();
  }


  async run() {
    try {
      await this._validateSession();
      await this._setActivity();

      this._setActivityData.closeConnection();

      return {
        status: 200,
        message: 'activity setted',
      };
    } catch (err) {
      throw err;
    }
  }

  async _setActivity() {
    try {
      const activityResponse = await this._setActivityData.setActivity({
        name: this._name,
        badge: this._badge,
        email: this._email,
        date: this._date,
        activityId: this._activityId,
        note: this._note,
      });

      return activityResponse;
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
      if (!this._name) throw (400, { name: 'undefined' });
      if (!this._badge) throw (400, { badge: 'undefined' });
      if (!this._email) throw (400, { email: 'undefined' });
      if (!this._date) throw (400, { date: 'undefined' });
      if (!this._activityId) throw (400, { activityId: 'undefined' });
    } catch (err) {
      console.log('err setActivity => ', err);
      throw err;
    }
  }
};
