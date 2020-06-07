export default class GenericDao {
  parseSelectResponse(resultSet: any = []) {
    const resultMapped: any = resultSet.reduce((acc: any, i: any) => {
      const newItem = { ...i };

      acc.push(newItem);
      return acc;
    }, []);

    if (resultMapped.length === 1)
      return resultMapped[0];

    return resultMapped;
  }

  parseInsertResponse(resultSet: any) {
    return Object.assign({}, resultSet);
  }
}
