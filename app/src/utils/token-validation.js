const validate = () => {
  return new Promise(async (resolve, reject) => {
    const token = localStorage.getItem('token');

    if (!token) return reject(false);
    return resolve(true);
  });
};

module.exports = {
  validate,
}


