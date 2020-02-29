const validate = {
  validate(url) {
    return new Promise(async (resolve, reject) => {
      const token = localStorage.getItem('token');

      if (!token) return reject(false);
      return resolve(true);
    });
  },
}

export default validate.validate


