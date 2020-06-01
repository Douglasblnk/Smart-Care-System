import { isObject } from 'lodash';
export const errorResponseTreatment = (err: any) => {
  const error = {
    status: '',
    msg: '',
  };

  if (err.status)
  if (err?.response) return err.response;
  if (err?.result) return err.result;

  return error;
};
