import Update from "../../../../shared/dao/Update";
import { SSUtils } from "../../../../shared/utils/utils";
const _ = require("lodash");

const commitData = new Update();
const isEmpty = new SSUtils();

const TABLE = "ordemServico_has_Usuario";

export default class UpdateDetalheUser {
  async run(event: any) {
    try {
      const data = this.getData(event);
      this.validateData(data);
      const getQuery = this.getQuery(data);

      const result = await commitData.run(getQuery);

      return result;
    } catch (err) {
      throw err;
    }
  }

  getData(evt: any) {
    const data = evt.body || undefined;
    const id = evt.params.id || undefined;

    return {
      ...data,
      id,
    };
  }
  validateData(data: any) {
    if (_.isEmpty(data))
      throw {
        status: 404,
        err: "Não existem dados",
      };
    if (data.id === "")
      throw {
        status: 404,
        err: "Não foi recebido Id",
      };
    isEmpty.verify(data, ["excluded"], "");

    if (data.excluded === "")
      throw {
        status: 404,
        err: "Nenhum dado encontrado",
      };
  }
  getQuery(data: any) {
    const values = { excluded: data.excluded };
    const where = [data.idOrdemServico];
    const query = `UPDATE ${TABLE} SET ? WHERE ordemServico_has_Usuario.ordemServico_idOrdemServico = ? AND ordemServico_has_Usuario.Usuario_idUsuario = ${data.idUsuario};`;

    const dataQuery = { query, values, where, type: "Manutentor" };

    return dataQuery;
  }
}
