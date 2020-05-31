import ConnectionFactory from './shared/connectionFactory/ConnectionFactory';
import Auth from './shared/auth/auth';

require('dotenv').config({ path: '.env' });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const connectionFactory = new ConnectionFactory();
const auth = new Auth();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(auth.run.bind(auth));
app.use(connectionFactory.createConnection.bind(connectionFactory));

// CRUDS
const user = require('./services/cruds/v1/User');
// const equipamento = require('./services/cruds/routes/Equipamento/Equipamento');
// const localInstalacao = require('./services/cruds/routes/LocalInstalacao/LocalInstalacao');
// const centroTrabalho = require('./services/cruds/routes/CentroTrabalho/CentroTrabalho');
// const tipoOrdem = require('./services/cruds/routes/TipoOrdem/TipoOrdem');
// const causa = require('./services/cruds/routes/Causa/Causa');
// const sintoma = require('./services/cruds/routes/Sintoma/Sintoma');
// const componente = require('./services/cruds/routes/Componente/Componente');
// const ordemManutencao = require('./services/cruds/routes/OrdemManutencao/OrdemManutencao');
// const tipoManutencao = require('./services/cruds/routes/TipoOrdem/TipoOrdem');
// const prioridade = require('./services/cruds/routes/Prioridade/Prioridade');
// const status = require('./services/cruds/routes/Status/Status');
// const epi = require('./services/cruds/routes/Epi/Epi');
// const nivelAcesso = require('./services/cruds/routes/NivelAcesso/nivelAcesso');
// const operacoes = require('./services/cruds/routes/Operacoes/Operacoes');

// MOVIMENTATIONS
// const detalhamento = require('./services/movimentations/routes/Detalhamento/Detalhamento');
// const verificacao = require('./services/movimentations/routes/Verificacao/Verificacao');
// const initiate = require('./services/movimentations/routes/Iniciar/InitiateOrder');
// const orderNote = require('./services/movimentations/routes/Apontar/OrderNote');

app.use('/users', user);
// app.use('/equipamento', equipamento);
// app.use('/local-instalacao', localInstalacao);
// app.use('/centro-trabalho', centroTrabalho);
// app.use('/tipo-ordem', tipoOrdem);
// app.use('/causa', causa);
// app.use('/sintoma', sintoma);
// app.use('/componente', componente);
// app.use('/ordem-manutencao', ordemManutencao);
// app.use('/tipo-manutencao', tipoManutencao);
// app.use('/prioridade', prioridade);
// app.use('/status', status);
// app.use('/epi', epi);
// app.use('/detalhamento', detalhamento);
// app.use('/verificacao', verificacao);
// app.use('/nivel-acesso', nivelAcesso);
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

