const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const summary = require('./summary/get');
const lastMonth = require('./orderByMonth/get');
const verificationsOrder = require('./verificationsOrder/get');
const verificationsOrderReport = require('./verificationsOrderReport/get');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/analysis/order-summary', async (req, res) => {
  try {
    const response = await summary.run(req);
    
    res.status(200).send(response);
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get('/analysis/last-month', async (req, res) => {
  try {
    const response = await lastMonth.run(req);
    
    res.status(200).send(response);
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get('/analysis/verifications-orders', async (req, res) => {
  try {
    const response = await verificationsOrder.run(req);
    
    res.status(200).send(response);
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get('/analysis/verifications-orders-report', async (req, res) => {
  try {
    const response = await verificationsOrderReport.run(req);
    
    res.status(200).send(response);
  } catch (err) {
    res.status(404).send(err);
  }
});

app.listen(3020, () => {
  console.log('Ouvindo na porta 3020!');
});
