const TruckModel = require('../../models/transporter/truck')
const QRCode = require('qrcode')
const multer = require('multer')

class TruckController { 
  static async addTruck(req, res, next) {
    const truckQrCode = await generateQrCode()
    res.json(
      {
        data: truckQrCode
      }
    )
  }
}

const generateQrCode = async () =>  {
  const truckNo = 'ABC 123 XY'
  return QRCode.toDataURL(`${process.env.URL}${process.env.BASE_URL}/lookup?truckref=${truckNo}`, { type: 'image/png'}, async (err, url) => {
    console.log(url)
   return url
  })
}

module.exports = TruckController