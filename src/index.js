const ConnectionFactory = require('./shared/database/ConnectionFactory');
const Auth = require('./shared/auth/auth');

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

app.use(connectionFactory.createConnection.bind(connectionFactory));
app.use(auth.run.bind(auth));

// CRUDS
const User = require('./services/cruds/routes/userModule/User');
const Status = require('./services/cruds/routes/crudsModule/Status');
const Symptom = require('./services/cruds/routes/crudsModule/Symptom');
const AccessLevel = require('./services/cruds/routes/crudsModule/AccessLevel');
const MaintenanceOrder = require('./services/cruds/routes/orderModule/MaintenanceOrder');
const Equipment = require('./services/cruds/routes/crudsModule/Equipment');
const InstallationLocation = require('./services/cruds/routes/crudsModule/InstallationLocation');
const Cause = require('./services/cruds/routes/crudsModule/Cause');
// const centroTrabalho = require('./services/cruds/routes/CentroTrabalho/CentroTrabalho');
// const tipoOrdem = require('./services/cruds/routes/TipoOrdem/TipoOrdem');
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

app.use('/users', User);
app.use('/status', Status);
app.use('/sintoma', Symptom);
app.use('/nivel-acesso', AccessLevel);
app.use('/ordem-manutencao', MaintenanceOrder);
app.use('/equipments', Equipment);
app.use('/local-instalacao', InstallationLocation);
app.use('/causa', Cause);
// app.use('/centro-trabalho', centroTrabalho);
// app.use('/tipo-ordem', tipoOrdem);
// app.use('/componente', componente);
// app.use('/tipo-manutencao', tipoManutencao);
// app.use('/prioridade', prioridade);
// app.use('/epi', epi);
// app.use('/detalhamento', detalhamento);
// app.use('/verificacao', verificacao);
// app.use('/operacoes', operacoes);
// app.use('/initiate', initiate);
// app.use('/order-note', orderNote);


app.get('/', res => {
  res.send('Smart Care API');
});

app.use(connectionFactory.closeConnection.bind(connectionFactory));

app.listen(process.env.PORT, () => {
  console.log(`Ouvindo na porta ${process.env.PORT}!`);
});

