const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { run } = require('./summary/get');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/analysis/order-summary', async (req, res) => {
  try {
    const response = await run(req);
    
    res.status(200).send(response);
  } catch (err) {
    res.status(404).send(err);
  }
});

app.listen(3020, () => {
  console.log('Ouvindo na porta 3020!');
});
