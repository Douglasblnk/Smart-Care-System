const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const ConnectionFactory = require('./shared/database/ConnectionFactory');
const Auth = require('./shared/auth/auth');

require('dotenv').config({ path: '.env' });

const app = express();
const connectionFactory = new ConnectionFactory();
const auth = new Auth();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(connectionFactory.createConnection.bind(connectionFactory));
app.use(auth.run.bind(auth));

// CRUDS
const User = require('./services/routes/cruds/User');
const Status = require('./services/routes/cruds/Status');
const Symptom = require('./services/routes/cruds/Symptom');
const AccessLevel = require('./services/routes/cruds/AccessLevel');
const MaintenanceOrder = require('./services/routes/cruds/MaintenanceOrder');
const Equipment = require('./services/routes/cruds/Equipment');
const InstallationLocation = require('./services/routes/cruds/InstallationLocation');
const Cause = require('./services/routes/cruds/Cause');
const Epi = require('./services/routes/cruds/Epi');
const OrderType = require('./services/routes/cruds/OrderType');
const Priority = require('./services/routes/cruds/Priority');
const WorkCenter = require('./services/routes/cruds/WorkCenter');
const Operation = require('./services/routes/cruds/Operation');
const Component = require('./services/routes/cruds/Component');

app.use('/users', User);
app.use('/status', Status);
app.use('/sintoma', Symptom);
app.use('/nivel-acesso', AccessLevel);
app.use('/ordem-manutencao', MaintenanceOrder);
app.use('/equipamento', Equipment);
app.use('/componente', Component);
app.use('/local-instalacao', InstallationLocation);
app.use('/causa', Cause);
app.use('/epi', Epi);
app.use('/tipo-ordem', OrderType);
app.use('/prioridade', Priority);
app.use('/centro-trabalho', WorkCenter);
app.use('/operacoes', Operation);


// MOVIMENTATIONS
const Verifications = require('./services/routes/movimentations/Verifications');
const Operations = require('./services/routes/movimentations/Operations');
const OrderStepsMovimentations = require('./services/routes/movimentations/OrderStepsMovimentations');
const DelegateMaintainer = require('./services/routes/movimentations/DelegateMaintainer');

// const detalhamento = require('./services/movimentations/routes/Detalhamento/Detalhamento');
// const orderNote = require('./services/movimentations/routes/Apontar/OrderNote');


app.use('/verificacao', Verifications);
app.use('/operacoes', Operations);
app.use('/movimentacao-etapa', OrderStepsMovimentations);
app.use('/delegar-manutentor', DelegateMaintainer);
// app.use('/detalhamento', detalhamento);
// app.use('/order-note', orderNote);

app.use(connectionFactory.closeConnection);

app.listen(process.env.PORT, () => {
  console.log(`Ouvindo na porta ${process.env.PORT}!`);
});
