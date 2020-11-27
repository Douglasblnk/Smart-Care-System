function errorResponseTreatment(err) {
  const error = {
    status: getStatusCode(err),
    msg: getErrorMessage(err),
  };

  return error;
}

function getErrorMessage(err) {
  if (
    err && (
      err.code === 'ER_DUP_ENTRY' || (err.message && err.message.toLowerCase().includes('duplicate'))
    )
  )
    return 'Já existe um registro com esse nome ou código!';

  if (err && err.response) return err.response;
  if (err && err.result) return err.result;
  if (err && err.msg) return err.msg;
  if (err && err.message) return err.message;
  return err;
}

function getStatusCode(err) {
  if (err.status) return err.status;
  if (err.statusCode) return err.statusCode;
  return 404;
}


function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}


module.exports = {
  errorResponseTreatment,
  isObjectEmpty,
};
