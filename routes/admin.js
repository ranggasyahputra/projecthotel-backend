const express = require("express")
const router = express.Router()
const db = require("../connection")
const response = require("../response")
const bcrypt = require("bcrypt")

// GET

router.get("/user", async (req, res) => {
  const { nama, id } = req.query
  if (nama) {
    const sql = `SELECT * FROM users WHERE nama="${nama}"`
    db.query(sql, (err, fields) => {
      if (err) throw err
      response(200, fields, "Data User", res)
    })
  } else if (id) {
    const sql = `SELECT * FROM users WHERE users_id=${id}`
    db.query(sql, (err, fields) => {
      if (err) throw err
      response(200, fields, "Data User", res)
    })
  }
})

router.get("/pesan", (req, res) => {
  const { kode, id } = req.query
  if (kode) {
    const sql = `SELECT * from kamar_pemesanan WHERE kode_pemesanan="${kode}"`
    db.query(sql, (err, fields) => {
      if (err) throw err
      response(200, fields, "Data Kamar Pemesanan Hotel", res)
    })

  } else if (id) {
    const sql = `SELECT * FROM kamar_pemesanan WHERE id_kamar_pemesanan=${id}`
    db.query(sql, (err, fields) => {
      if (err) throw err
      response(200, fields, "Data Kamar Hotel", res)
    })
  }

  else {
    const sql = `SELECT * FROM pesan_hotel WHERE isDeleted IS NULL`
    db.query(sql, (err, fields) => {
      if (err) throw err
      response(200, fields, "Data Pemesanan Hotel", res)
    })
  }
})

router.get("/hotel", (req, res) => {
  const { offset, nama_hotel,kode_hotel} = req.query
  if (offset) {
    if (offset !== 0) {
      const sql = `SELECT * FROM data_hotel LIMIT 10 OFFSET ${offset}`
      db.query(sql, (err, fields) => {
        const page = (offset / 10) + 1
        if (err) throw err
        response(200, fields, `Data Hotel ${page}`, res)
      })
    }
  } else if (nama_hotel) {
    const sql = `SELECT * FROM data_hotel WHERE nama="${nama_hotel}"`
    db.query(sql, (err, fields) => {
      if (err) throw err  
      response(200, fields, `Data Hotel ${nama_hotel}`, res)
    })
  } else if (kode_hotel) {
    const sql =`SELECT * FROM data_hotel WHERE kode_hotel = "${kode_hotel}"`
    db.query(sql,(err,fields) => {
      if (err) throw err
      response(200,fields,`Data Hotel ${kode_hotel}`, res)
    })
  } else {
    const sql = `SELECT * FROM data_hotel`
    db.query(sql, (err, fields) => {
      if (err) throw err
      response(200, fields, `Data Semua Hotel`, res)
    })
  }
})

router.get("/hotel/count", (req, res) => {
  const sql = `SELECT COUNT(hotel_id) AS total_hotel FROM data_hotel`
  db.query(sql, (err, fields) => {
    if (err) throw err
    response(200, fields, "Jumlah Hotel", res)
  })

})

// PUT

router.put("/user", (req, res) => {
  const { users_id, nama, nickname, email, no_telepon, role } = req.body
  const sql = `UPDATE users SET nama="${nama}", nickname= "${nickname}", email="${email}", no_telepon="${no_telepon}", role="${role}" WHERE users_id="${users_id}"`
  if (users_id === "" || nama === "" || nickname === "" || email === "" || no_telepon === "" || role === "") {
    response(403, "Invalid", "Tolong Masukan Data terlebih Dahulu!", res)
  } else {
    db.query(sql, (err, fields) => {
      if (err) throw err
      response(200, fields, "Edit Data Berhasil", res)
    })
  }
})

router.put("/kamar", async (req, res) => {
  const { id_kamar_pemesanan, kode_pemesanan, nomor_kamar } = req.body
  const sql = `SELECT * FROM kamar_pemesanan WHERE kode_pemesanan="${kode_pemesanan}" AND nomor_kamar=${nomor_kamar}`
  const [result] = await db.promise().query(sql)
  if (result.length === 0) {
    const sql = `UPDATE kamar_pemesanan SET nomor_kamar=${nomor_kamar} WHERE id_kamar_pemesanan=${id_kamar_pemesanan}`
    db.query(sql, (err, fields) => {
      if (err) throw err
      response(200, fields, "Data Sukses Diubah!", res)
    })
  } else {
    response(403, "Coba Lagi", "Kamar yang anda masukkan sudah anda pakai", res)
  }
})

router.put("/hotel", (req,res) => {
  const {kode_hotel, nama, harga, provinsi, deskripsi} = req.body
  const sql = `UPDATE data_hotel SET nama="${nama}" , harga=${harga}, provinsi="${provinsi}", deskripsi="${deskripsi}" WHERE kode_hotel="${kode_hotel}"`
  db.query(sql,(err,fields) => {
    if(err) throw err
    response(200, fields, "Data Berhasil diubah!", res)
  })
})


module.exports = router