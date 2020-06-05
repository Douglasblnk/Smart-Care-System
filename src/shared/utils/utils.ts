export const errorResponseTreatment = (err: any) => {
  const error = {
    status: getStatusCode(err),
    msg: getErrorMessage(err),
  };

  return error;
};

function getErrorMessage(err: any) {
  if (err?.code === 'ER_DUP_ENTRY' || err?.message?.includes('Duplicate'))
    return 'Já existe um registro com esse nome ou código!';

  if (err?.response) return err.response;
  if (err?.result) return err.result;
  if (err?.msg) return err.msg;
  if (err?.message) return err.message;
  return err;
}

function getStatusCode(err: any) {
  if (err?.status) return err.status;
  return 404;
}
