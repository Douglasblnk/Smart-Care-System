const SetActivity = require('../../lib/session/SetActivity');

const getParameters = req => ({
  auth: req.headers.authorization || '',
  origin: req.headers.origin || '',
  nome: req.body.activity.nome || '',
  cracha: req.body.activity.cracha || '',
  email: req.body.activity.email || '',
  date: req.body.activity.date || '',
  activityId: req.body.activityId || '',
  descricao: req.body.activity.descricao || '',
});

const checkParameters = ({
  auth,
  origin,
  nome,
  cracha,
  email,
  date,
  activityId,
} = {}) => ({
  ...(!auth ? { auth: 'undefined' } : ''),
  ...(!origin ? { origin: 'undefined' } : ''),
  ...(!nome ? { nome: 'undefined' } : ''),
  ...(!cracha ? { cracha: 'undefined' } : ''),
  ...(!email ? { email: 'undefined' } : ''),
  ...(!date ? { date: 'undefined' } : ''),
  ...(!activityId ? { activityId: 'undefined' } : ''),
});

const run = async req => {
  try {
    const parameters = getParameters(req);

    const errs = checkParameters(parameters);
    if (Object.keys(errs).length > 0) throw errs;

    const response = await new SetActivity(parameters).run();

    return response;
  } catch (err) {
    console.log('err set => ', err);
    throw err;
  }
};

module.exports = {
  run,
};
