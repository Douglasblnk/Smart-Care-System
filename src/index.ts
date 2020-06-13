import ConnectionFactory from './shared/database/ConnectionFactory';
import Auth from './shared/auth/auth';

require('dotenv').config({ path: '.env' });

import express = require('express');
import cors = require('cors');
import bodyParser = require('body-parser');

const app = express();
const connectionFactory = new ConnectionFactory();
const auth = new Auth();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(connectionFactory.createConnection.bind(connectionFactory));
app.use(auth.run.bind(auth));

// CRUDS
import user from './services/cruds/routes/userModule/User';
import status from './services/cruds/routes/crudsModule/Status';
import sintoma from './services/cruds/routes/crudsModule/Symptom';
import nivelAcesso from './services/cruds/routes/crudsModule/AccessLevel';
import ordemManutencao from './services/cruds/routes/orderModule/MaintenanceOrder';

// const equipamento = require('./services/cruds/routes/Equipamento/Equipamento');
// const localInstalacao = require('./services/cruds/routes/LocalInstalacao/LocalInstalacao');
// const centroTrabalho = require('./services/cruds/routes/CentroTrabalho/CentroTrabalho');
// const tipoOrdem = require('./services/cruds/routes/TipoOrdem/TipoOrdem');
// const causa = require('./services/cruds/routes/Causa/Causa');
// const componente = require('./services/cruds/routes/Componente/Componente');
// const tipoManutencao = require('./services/cruds/routes/TipoOrdem/TipoOrdem');
// const prioridade = require('./services/cruds/routes/Prioridade/Prioridade');
// const epi = require('./services/cruds/routes/Epi/Epi');
// const operacoes = require('./services/cruds/routes/Operacoes/Operacoes');

// MOVIMENTATIONS
// const detalhamento = require('./services/movimentations/routes/Detalhamento/Detalhamento');
// const verificacao = require('./services/movimentations/routes/Verificacao/Verificacao');
// const initiate = require('./services/movimentations/routes/Iniciar/InitiateOrder');
// const orderNote = require('./services/movimentations/routes/Apontar/OrderNote');

app.use('/users', user);
app.use('/status', status);
app.use('/sintoma', sintoma);
app.use('/nivel-acesso', nivelAcesso);
app.use('/ordem-manutencao', ordemManutencao);
// app.use('/equipamento', equipamento);
// app.use('/local-instalacao', localInstalacao);
// app.use('/centro-trabalho', centroTrabalho);
// app.use('/tipo-ordem', tipoOrdem);
// app.use('/causa', causa);
// app.use('/componente', componente);
// app.use('/tipo-manutencao', tipoManutencao);
// app.use('/prioridade', prioridade);
// app.use('/epi', epi);
// app.use('/detalhamento', detalhamento);
// app.use('/verificacao', verificacao);
// app.use('/operacoes', operacoes);
// app.use('/initiate', initiate);
// app.use('/order-note', orderNote);


app.get('/', (req: any, res: any) => {
  res.send('Smart Care API');
});

app.use(connectionFactory.closeConnection.bind(connectionFactory));

app.listen(process.env.PORT, () => {
  console.log(`Ouvindo na porta ${process.env.PORT}!`);
});

