const { get } = require('lodash');
const SetActivity = require('../../lib/session/SetActivity');

const getParameters = req => ({
  auth: get(req.headers, 'authorization', ''),
  activityId: get(req.body, 'activityId', ''),
  name: get(req.body.userInformation, 'nome', ''),
  badge: get(req.body.userInformation, 'cracha', ''),
  email: get(req.body.userInformation, 'email', ''),
  date: get(req.body.userInformation, 'date', ''),
  note: get(req.body, 'note', ''),
});

const checkParameters = ({
  auth,
  activityId,
  name,
  badge,
  email,
  date,
} = {}) => ({
  ...(!auth ? { auth: 'undefined' } : ''),
  ...(!activityId ? { activityId: 'undefined' } : ''),
  ...(!name ? { name: 'undefined' } : ''),
  ...(!badge ? { badge: 'undefined' } : ''),
  ...(!email ? { email: 'undefined' } : ''),
  ...(!date ? { date: 'undefined' } : ''),
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
