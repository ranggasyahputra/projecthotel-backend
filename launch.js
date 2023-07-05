const express = require("express")
const app = express()
const port = 3300
const db = require("./connection")
const chalk = require("chalk")
const hotelsEndpoint = require("./routes/hotel")
const usersEndpoint = require("./routes/users")
const pesanEndpoint = require("./routes/pesan")
const adminEndpoint = require("./routes/admin")

db.connect((err) => {
  if(err) {
    console.error(`ERROR OCCURED:`)
    console.error(err)
    return
  }
  console.log(chalk.magenta("CONNECTED TO PROJECT DATABASE"))
})

const cors = require("cors")
app.use(express.json())
app.use(cors())
app.use("/hotel", hotelsEndpoint)
app.use("/users", usersEndpoint)
app.use("/pesan", pesanEndpoint)
app.use("/admin", adminEndpoint)

app.listen(port,()=> {
  console.log(`RUNNING SERVER ON PORT `+ chalk.yellow(port))
})