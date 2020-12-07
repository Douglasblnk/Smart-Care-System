const { get } = require('lodash');
const AppointmentsDao = require('../../../dao/movimentations/AppointmentsDao');

module.exports = class RegisterAppointment {
  getParameters(req) {
    return {
      user: get(req.body, 'user', ''),
      order: get(req.body, 'order', ''),
      date: get(req.body, 'date', ''),
      time: get(req.body, 'time', ''),
      description: get(req.body, 'description', ''),
      mysql: get(req, 'mysql'),
      authData: get(req, 'authData', ''),
    };
  }

  checkParameters({
    user,
    order,
    date,
    time,
    description,
    mysql,
    authData,
  }) {
    return {
      ...(!user ? { user: 'Usuário não informado' } : ''),
      ...(!order ? { order: 'Ordem não informado' } : ''),
      ...(!date ? { date: 'Data não informada' } : ''),
      ...(!time ? { time: 'Tempo não informado' } : ''),
      ...(!description ? { description: 'Descrição não informada' } : ''),
      ...(!mysql ? { mysql: 'Conexão não estabelecida' } : ''),
      ...(!authData ? { authData: 'Dados de autenticação não encontrados' } : ''),
    };
  }

  async run(req) {
    try {
      const parameters = this.getParameters(req);

      const errors = this.checkParameters(parameters);
      if (Object.values(errors).length > 0) throw errors;

      await this.validateUser(parameters);

      const response = await this.registerAppointment(parameters);

      if (!response.affectedRows)
        throw 'Nenhum registro foi inserido';

      return response;
    } catch (err) {
      console.log('err RegisterAppointments :>> ', err);

      throw err;
    }
  }

  async registerAppointment(parameters) {
    return new AppointmentsDao(parameters).registerAppointment();
  }

  async validateUser(parameters) {
    try {
      const appointmentsUser = await new AppointmentsDao(parameters).validateUserAppointment();

      if (appointmentsUser.length < 1 && appointmentsUser.length !== undefined)
        throw 'Este usuário não esta relacionado a esta ordem';
    } catch (err) {
      console.log('err RegisterAppointments :>> ', err);

      throw err;
    }
  }
};
