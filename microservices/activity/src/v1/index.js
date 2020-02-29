const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { run } = require('./activity/set');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.post('/activity/set', async (req, res) => {
  try {
    const response = await run(req);

    res.status(200).send(response);
  } catch (err) {
    res.status(404).send(err);
  }
});

// app.get('/activity/get', async (req, res) => {
//   try {
    

//     res.status(200).send(response);
//   } catch (err) {
//     res.status(404).send(err);
//   }
// });

app.listen(3010, () => {
  console.log('Ouvindo na porta 3010!');
});
