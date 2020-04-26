const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const user = require("./routes/Usuario/User");
const equipamento = require("./routes/Equipamento/Equipamento");
const localInstalacao = require("./routes/LocalInstalacao/LocalInstalacao");
const centroTrabalho = require("./routes/CentroTrabalho/CentroTrabalho");
const tipoOrdem = require("./routes/TipoOrdem/TipoOrdem");
const causa = require("./routes/Causa/Causa");
const sintoma = require("./routes/Sintoma/Sintoma");
const getEquipment = require("./routes/Equipamento/Equipamento");
const componente = require("./routes/Componente/Componente");
const ordemManutencao = require("./routes/OrdemManutencao/OrdemManutencao");
const tipoManutencao = require("./routes/TipoOrdem/TipoOrdem");
const prioridade = require("./routes/Prioridade/Prioridade");
const status = require("./routes/Status/Status");
const epi = require("./routes/Epi/Epi");
const detalhamento = require('./routes/Detalhamento/Detalhamento');
const nivelAcesso = require("./routes/NivelAcesso/nivelAcesso");


app.use("/users", user);
app.use("/equipamento", equipamento)
app.use("/local-instalacao", localInstalacao)
app.use("/centro-trabalho", centroTrabalho)
app.use("/tipo-ordem", tipoOrdem)
app.use("/causa", causa)
app.use("/sintoma", sintoma)
app.use("/componente", componente)
app.use("/ordem-manutencao", ordemManutencao)
app.use("/tipo-manutencao", tipoManutencao)
app.use("/prioridade", prioridade)
app.use("/status", status)
app.use("/epi", epi)
app.use("/detalhamento", detalhamento)
app.use("/nivel-acesso", nivelAcesso)


app.get("/", (req: any, res: any) => {
  res.send("Smart Care API");
});

app.listen(3000, function () {
  console.log('Ouvindo na porta 3000!');
});
