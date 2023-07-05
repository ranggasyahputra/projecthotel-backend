const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function generateCode( nomor,kode_hotel, kamar_hotel) {
  let result = ""

  for (let i=0; i < 6; i++) {
    result += char.charAt(Math.floor(Math.random() * 6))
  }
  let code = `${kode_hotel}KM${kamar_hotel}${nomor}${result}`
  return code
}

module.exports = generateCode