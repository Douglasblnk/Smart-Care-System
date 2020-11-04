module.exports = class GenericDao {
  parseSelectResponse(resultSet = []) {
    const resultMapped = resultSet.reduce((acc, i) => {
      const newItem = { ...i };

      acc.push(newItem);
      return acc;
    }, []);

    if (resultMapped.length === 1)
      return resultMapped[0];

    return resultMapped;
  }

  parseInsertResponse(resultSet) {
    return JSON.parse(JSON.stringify(resultSet));
  }

  parseMultipleInsertResponse(resultSet) {
    const parsedResultSet = this.parseInsertResponse(resultSet);

    return parsedResultSet.flat(2).filter(i => i);
  }
};
