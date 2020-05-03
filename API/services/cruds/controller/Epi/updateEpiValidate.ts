import Update from "../../../../shared/dao/Update";
import { SSUtils } from "../../../../shared/utils/utils";
const _ = require("lodash");

const commitData = new Update();
const isEmpty = new SSUtils();

const TABLE = "epi";

export default class UpdateEpiValidate {
  async run(event: any) {
    try {
      const data = this.getData(event);
      this.validate(data);
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
	
  validate(data: any) {
    if (_.isEmpty(data))
      throw {
        status: 404,
        err: "Não existem dados",
      };
    if (data.id === "" || data.id === undefined)
      throw {
        status: 404,
        err: "Não foi possivel encontrar EPI",
      };
    isEmpty.verify(data, ["descricaoEpi"], "");

    if (data.descricaoEpi === "")
      throw {
        status: 404,
        err: "Epi nao encontrado",
      };
	}
	
  getQuery(data: any) {
    const values = { descricaoEpi: data.descricaoEpi };
    const where = data.id;
    const query = `UPDATE ${TABLE} SET ? WHERE idEpi = ?;`;

    const dataQuery = { query, values, where, type: "epi" };

    return dataQuery;
  }
}
