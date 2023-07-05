const mysql = require("mysql2")

const db = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"project_hotel"
})

module.exports = db