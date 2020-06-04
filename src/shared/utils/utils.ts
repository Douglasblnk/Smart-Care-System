export const errorResponseTreatment = (err: any) => {
  const error = {
    status: 404,
    msg: '',
  };

  if (err?.status) error.status = err.status;
  if (err?.response) error.msg = err.response;
  if (err?.result) error.msg = err.result;
  if (err?.msg) error.msg = err.msg;
  else error.msg = err;

  return error;
};
