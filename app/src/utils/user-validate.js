export const validate = apiUrl => {
  return new Promise((resolve, reject) => {
    fetch(`${apiUrl}/users/token`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${localStorage.getItem('token')}`
      },
    }).then(res => res.json())
      .then(json => {
        console.log(json);
        if (json.authorized) return resolve('Autenticado!')
        return reject(json)
      })
  })
}