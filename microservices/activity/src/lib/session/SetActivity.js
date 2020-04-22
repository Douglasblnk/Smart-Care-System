const GetUserAutentication = require('../integration/GetUserAuthentication');
const SetActivityData = require('../datasource/SetActivityData');

const RESOURCE_ORIGIN = 'http://localhost:8080';


module.exports = class SetActivity {
  constructor({
    auth,
    origin,
    nome,
    cracha,
    email,
    date,
    activityId,
    descricao = '',
  } = {}) {
    this._auth = auth;
    this._origin = origin;
    this._nome = nome;
    this._cracha = cracha;
    this._email = email;
    this._date = date;
    this._activityId = activityId;
    this._descricao = descricao;

    this._checkParameters();

    this._integrationAuthJwt = new GetUserAutentication();

    this._setActivityData = new SetActivityData(
      this._nome,
      this._cracha,
      this._email,
      this._date,
      this._activityId,
      this._descricao,
    );
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
      const activityResponse = await this._setActivityData.setActivity();

      return activityResponse;
    } catch (err) {
      throw err;
    }
  }

  async _validateSession() {
    try {
      if (this._auth === 'unnecessaryToken' && this._origin === RESOURCE_ORIGIN) return;

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
      if (!this._origin) throw (400, { origin: 'undefined' });
      if (!this._nome) throw (400, { nome: 'undefined' });
      if (!this._cracha) throw (400, { cracha: 'undefined' });
      if (!this._email) throw (400, { email: 'undefined' });
      if (!this._date) throw (400, { date: 'undefined' });
      if (!this._activityId) throw (400, { activityId: 'undefined' });
    } catch (err) {
      console.log('err setActivity => ', err);
      throw err;
    }
  }
};
