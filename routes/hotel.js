const express = require("express")
const router = express.Router()
const db = require("../connection")
const response = require("../response")

router.get("/" , (req, res) => {
  const {offset, nama_hotel} = req.query
  if(offset){
    if(offset !== 0) {
      const sql = `SELECT * FROM data_hotel LIMIT 10 OFFSET ${offset}`
      db.query(sql,(err,fields) => {
        const page = (offset / 10) + 1
        if(err) throw err 
        response(200, fields, `Data Hotel ${page}`, res)
      }) 
    } 
  } else if (nama_hotel){
    const sql = `SELECT * FROM data_hotel WHERE nama="${nama_hotel}"`
    db.query(sql,(err,fields) => {
      if(err) throw err
      response(200,fields,`Data Hotel ${nama_hotel}`, res)
    })
  } else {
    const sql = `SELECT nama FROM data_hotel`
    db.query(sql, (err, fields) => {
      if(err) throw err
      response(200, fields, `Data Semua Hotel`, res)
    })
  }
})

router.get("/:id", (req, res) => {
  const { id } = req.params
  
  if (id === "populer") {
    res.send("hotel rekomendasi")
  } else if(id === "count") {
    const sql = `SELECT COUNT(nama) AS total_hotel FROM data_hotel`
    db.query(sql, (err, fields) => {
      if(err) throw err
      response(200,fields,"Jumlah Data Hotel", res)
    })
  }
  
  else {
    const sql = `SELECT * FROM data_hotel WHERE UPPER(provinsi) = "${id.toUpperCase()}"`
    db.query(sql,(err,fields) => {
      if(err) throw err 
      response(200, fields, `Data Hotel Provinsi ${id}`, res)
    })
  }
})

router.get('/detail/:id',(req,res) => {
  const {id} = req.params
  const sql = `SELECT * FROM data_hotel WHERE kode_hotel = "${id}"`
  db.query(sql, (err, fields) => {
    if(err) throw err
    response(200, fields, `Data Hotel ${fields[0].provinsi}`, res)
  })
})

router.post("/", (req, res) => {
  const { nama, kode_hotel, harga, provinsi, deskripsi, rating } = req.body
  const sql = `INSERT INTO data_hotel (hotel_id, nama, kode_hotel, harga, provinsi, deskripsi, rating) VALUES (NULL, ?, ?, ?, ?, ?, ?)`
  db.query(sql, [nama, kode_hotel, harga, provinsi, deskripsi, rating], (err, fields) => {
    if (err) throw err
    response(200, fields, "Data Hotel berhasil ditambahkan", res) 
  })
})

module.exports = router
