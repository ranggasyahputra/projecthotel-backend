const express = require("express")
const router = express.Router()
const db = require("../connection")
const response = require("../response")
const generateCode = require("../utils/randomCode")


router.get("/", (req, res) => {
  const { kode_hotel, user, kode_pemesanan } = req.query

  if(kode_hotel) { 
    const sql = `SELECT * FROM data_hotel WHERE kode_hotel = "${kode_hotel}"`
    db.query(sql, (err, fields) => {
      if (err) throw err
      response(200, fields, "Data Pemesanan Hotel", res)
    })
  }

  if(user) {
    const sql = `SELECT * FROM pesan_hotel INNER JOIN data_hotel ON pesan_hotel.kode_hotel = data_hotel.kode_hotel WHERE pesan_hotel.user = "${user}" AND isDeleted IS NULL`
    db.query(sql,(err,fields) => {  
      if(err) throw err
      response(200,fields,`Data Pemesanan hotel ${user}`,res)
    })

  }
  if(kode_pemesanan) {
    const sql = `SELECT * FROM kamar_pemesanan INNER JOIN data_hotel ON kamar_pemesanan.nama_hotel = data_hotel.nama WHERE kamar_pemesanan.kode_pemesanan= "${kode_pemesanan}"`
    db.query(sql,(err,fields) => {
      if(err) throw err
      response(200,fields,"Data Kamar Hotel", res)
    })
  }
})

router.get("/:param",(req,res) => {
  const {param} = req.params
  if(param === "limit") {
      const sql = `SELECT * FROM pesan_hotel WHERE isDeleted IS  NULL ORDER BY id_pemesanan DESC LIMIT 5 `
      db.query(sql, (err, fields) => {
        if(err) throw err
        response(200, fields, "Data Pemesanan Hotel Terbaru", res)
      })
  } 
})


router.post("/", async (req, res) => {
  const { nama, nomor_tlp, kode_hotel, nama_hotel, jumlah_kamar, durasi, total_harga } = req.body
  const kode_pemesanan = generateCode(nomor_tlp, kode_hotel, jumlah_kamar)
  const values = [null, nama, nomor_tlp, kode_pemesanan, kode_hotel, nama_hotel, jumlah_kamar, durasi, total_harga]
  if (jumlah_kamar === 0 || durasi === 0 || total_harga === 0) {
    response(403,"Invalid Input", "Tolong isi Kolom!", res)
  }
  try {
    const sql = `INSERT INTO pesan_hotel (id_pemesanan, user, no_telepon, kode_pemesanan, kode_hotel, nama_hotel, jumlah_kamar, durasi, total_harga) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    db.query(sql, values, (err, fields) => {
      if (err) throw err
    })

  } catch (err) {
    response(404,err, "ERROR", res)
  } finally {
    
    for (let i = 0; i <= jumlah_kamar; i++) {
      const kamar = Math.floor(Math.random() * 51)
      const values = [null, nama, kode_pemesanan, kamar, kode_hotel, nama_hotel, durasi]
      const sql = `INSERT INTO kamar_pemesanan (id_kamar_pemesanan, nama_pemesan, kode_pemesanan, nomor_kamar, kode_hotel, nama_hotel, durasi) VALUES(?, ?, ?, ?, ?, ?, ?)`
      db.query(sql, values, (err, fields) => {
        if (err) throw err
        console.log(fields)
      })
    }
    response(200,"SUCCESS", "Pemesanan Berhasil!", res)
  }
})

module.exports = router