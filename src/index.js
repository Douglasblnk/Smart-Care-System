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
const User = require('./services/cruds/routes/User');
const Status = require('./services/cruds/routes/Status');
const Symptom = require('./services/cruds/routes/Symptom');
const AccessLevel = require('./services/cruds/routes/AccessLevel');
const MaintenanceOrder = require('./services/cruds/routes/MaintenanceOrder');
const Equipment = require('./services/cruds/routes/Equipment');
const InstallationLocation = require('./services/cruds/routes/InstallationLocation');
const Cause = require('./services/cruds/routes/Cause');
const Epi = require('./services/cruds/routes/Epi');
const OrderType = require('./services/cruds/routes/OrderType');
const Priority = require('./services/cruds/routes/Priority');
const WorkCenter = require('./services/cruds/routes/WorkCenter');
const Operation = require('./services/cruds/routes/Operation');

app.use('/users', User);
app.use('/status', Status);
app.use('/sintoma', Symptom);
app.use('/nivel-acesso', AccessLevel);
app.use('/ordem-manutencao', MaintenanceOrder);
app.use('/equipments', Equipment);
app.use('/local-instalacao', InstallationLocation);
app.use('/causa', Cause);
app.use('/epi', Epi);
app.use('/tipo-ordem', OrderType);
app.use('/prioridade', Priority);
app.use('/centro-trabalho', WorkCenter);
app.use('/operacoes', Operation);


// MOVIMENTATIONS
// const detalhamento = require('./services/movimentations/routes/Detalhamento/Detalhamento');
// const verificacao = require('./services/movimentations/routes/Verificacao/Verificacao');
// const initiate = require('./services/movimentations/routes/Iniciar/InitiateOrder');
// const orderNote = require('./services/movimentations/routes/Apontar/OrderNote');


// app.use('/detalhamento', detalhamento);
// app.use('/verificacao', verificacao);
// app.use('/initiate', initiate);
// app.use('/order-note', orderNote);

app.use(connectionFactory.closeConnection);

app.listen(process.env.PORT, () => {
  console.log(`Ouvindo na porta ${process.env.PORT}!`);
});
