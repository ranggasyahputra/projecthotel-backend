function dataConfirm (affectedRows, insertedId) {
  const data = {
    isSuccess: affectedRows,
    idNumber:insertedId
  }
  return data
}

module.exports = dataConfirm