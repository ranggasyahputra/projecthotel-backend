const express = require("express")
const router = express.Router()
const db = require("../connection")
const response = require("../response")
const validator = require("validator")
const dataConfirm = require("../utils/dataConfirm")
const bcrypt = require("bcrypt")
router.get("/", (req, res) => {
  const { nama } = req.query
  if (nama) {
    const sql = `SELECT * FROM users WHERE nama="${nama}"`
    db.query(sql, (err, fields) => {  
      if (err) throw err
      response(200, fields, `Data user ${nama}`, res)
    })
  } else {
    const sql = `SELECT * FROM users`
    db.query(sql, (err, fields) => {
      if (err) throw err
      response(200, fields, "Data Users", res)
    })
  }
})

router.get("/:param" , (req, res) => {
  const {param} = req.params
  if(param === "count") {
    const sql = `SELECT COUNT(nama) AS total_user FROM users`
    db.query(sql,(err, fields) => {
      if(err) throw err
      response(200,fields,"Jumlah User", res)
    })
  }
})


router.post("/register", async (req, res) => {
  const { email, nama, no_telepon, password, passwordConfirm } = req.body

  const sql = `INSERT INTO users (users_id, nama, email, password, role, no_telepon, amount) VALUES (NULL, ?, ?, ?, "user", ?, NULL)`

  if (passwordConfirm !== password) {
    response(422, "Invalid", "Password Konfirmasi harus sama!", res)

  } else if (validator.isEmail(email) !== true) {
    response(422, "Invalid", "Tolong isi dengan alamat Email anda!", res)
  } else {
    const hashedPassword = await bcrypt.hash(password, 15)
    db.query(sql, [nama, email, hashedPassword, no_telepon], (err, fields) => {
      if (err) throw err
      const dataSucceed = dataConfirm(fields.affectedRows, fields.insertId)
      response(200, dataSucceed, "Akun Berhasil dibuat", res)
      console.log(fields)
    })
  }
})

router.post("/login", async (req, res) => {
  const { email, password } = req.body
  if (!email === "admin") {
    const sql = `SELECT * FROM users WHERE email = ?`
    const [result] = await db.promise().query(sql, [email])
    const resultShown = result.flat()
    if (result.length === 0) {
      response(403, "Not Found", "Email tidak ditemukan", res)
    } else {
      const hashedPassword = result[0].password
      const comparedPassword = await bcrypt.compare(password, hashedPassword)
      const dataToFront = {
        nama: result[0].nama,
        email: result[0].email,
        role: result[0].role,
        telepon: result[0].no_telepon
      }
      if (comparedPassword === true) {
        response(200, dataToFront, "Login Berhasil", res)
      } else if (password.length === 0) {
        response(403, "Not Found", "Tolong isi password!", res)
      } else {
        response(403, "Not Found", "Password Salah", res)
      }
    }
  } else {
    const sql = `SELECT * FROM users WHERE email = ?`
    const [result] = await db.promise().query(sql, [email])
    if (result.length === 0) {
      response(403, "Not Found", "Email tidak ditemukan", res)
    } else {
       const dataToFront = {
        nama: result[0].nama,
        email: result[0].email,
        role: result[0].role,
        telepon: result[0].no_telepon
      }
      response(200, dataToFront, "Login Berhasil", res)
    }
  }
})

router.put("/", (req, res) => {
  const { users_id, nama, nickname, email, no_telepon } = req.body
  if (validator.isEmail(email) !== true) {
    response(403, "Invalid Input", "Tolong Masukan Email!", res)
  } else if (validator.isMobilePhone(no_telepon) !== true) {
    response(403, "Invalid Data", "Masukan Nomor Telepon yang Valid!", res)
  } else {
    if (!nickname === "") {
      const sql = `UPDATE users SET nama="${nama}", nickname= NULL, email="${email}", no_telepon="${no_telepon}" WHERE users_id="${users_id}"`
      db.query(sql, (err, fields) => {
        if (err) throw err
        response(200, fields, "Data Terupdate", res)
        console.log(fields)
      })
    } else {
      const sql = `UPDATE users SET nama="${nama}", nickname= "${nickname}", email="${email}", no_telepon="${no_telepon}" WHERE users_id="${users_id}"`
      db.query(sql, (err, fields) => {
        if (err) throw err
        response(200, fields, "Data Terupdate", res)
        console.log(fields)
      })

    }

    // const sql = `UPDATE users SET nama="${nama}", nickname="${null}", email="${email}", no_telepon="${no_telepon}" WHERE users_id="${users_id}"`
    // db.query(sql, (err, fields) => {
    //   if (err) throw err
    //   response(200, fields, "Data Terupdate", res)
    //   console.log(fields)
    // })

  }
})

router.put("/password", async (req, res) => {
  const { nama, oldPassword, newPassword } = req.body
  if (oldPassword === "" || newPassword === "") {
    response(403, "Invalid", "Tolong Masukkan Password!", res)
  }
  const sql = `SELECT * FROM users WHERE nama = ?`
  const [result] = await db.promise().query(sql, [nama])
  const hashedPassword = result[0].password
  const comparedPassword = await bcrypt.compare(oldPassword, hashedPassword)

  if (!comparedPassword) {
    response(403, "Invalid", "Password tidak Ditemukan", res)
  } else {
    const newHashedPassword = await bcrypt.hash(newPassword, 15)
    const sql = `UPDATE users SET password=? WHERE nama=?`
    db.query(sql, [newHashedPassword, nama], (err, fields) => {
      if (err) throw err
      response(200, fields, `Password ${nama} berhasil diubah`, res)
    })
  }
})
router.put("/foto", (req, res) => {
  const { nama, foto_profil } = req.body
  if (foto_profil) {
    const sql = `UPDATE users SET foto_profil=? WHERE nama=?`
    db.query(sql, [foto_profil, nama], (err, fields) => {
      if (err) throw err
      response(200, fields, `Foto Profil ${nama} berhasil diubah`, res)
    })
  }
})

// console.log(hashedPassword)



module.exports = router 