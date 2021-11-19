const TruckModel = require("../../models/transporter/truck");
const { response } = require("../../middleware/response");
const { validationResult } = require("express-validator");
const QRCode = require("qrcode");
const multer = require("multer");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const uploader = multer({ dest: "upload/", fileFilter: fileFilter });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class TruckController {
  static async availableForCallUp(req, res, next) {
    try {
      const owner = await TruckModel.findOne({ ownedBy: req.userId })
      let availableForCallUp = []
      if(owner.trucks.length > 0) {
        const getTrucks = owner.trucks.map(truckInstance => {
          if(
            truckInstance.availableForCallUp && 
            truckInstance.activationStatus && 
            truckInstance.verificationStatus) {
            availableForCallUp.push({
              _id: truckInstance._id,
              plateNo: truckInstance.plateNo
            })
          }
        })
      }
      response(
        res, 200, availableForCallUp, 'trucks available for call up'
      )
    }
    catch(err) {
      response(
        res, 500, err.message, 'internal server error', 
      )
    }
  }

  static async getVerifiedTrucks(req, res, next) {
    try {
      let verifiedTrucks = [];
      const getTrucks = await TruckModel.findOne({
        ownedBy: req.userId,
      }).populate(
        "trucks.truckType trucks.union trucks.length",
        "truckType acronym truckLength"
      );
      getTrucks.trucks.map((truck) => {
        if (
          truck.verificationStatus === true &&
          truck.activationStatus === true
        )
          verifiedTrucks.push(truck);
      });
      response(res, 200, verifiedTrucks, "verified trucks");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async trucksPendingVerification(req, res, next) {
    const trucksOwnedBy = await TruckModel.findOne({
      ownedBy: req.userId,
    }).populate("trucks.truckType trucks.union trucks.length");
    let pendingVerifications = [];
    trucksOwnedBy.trucks.map((truck) => {
      if (!truck.verificationStatus) {
        const truckObjResp = {
          _id: truck._id,
          truckName: truck.truckName,
          truckModel: truck.truckModel,
          plateNo: truck.plateNo,
          chasisNo: truck.chasisNo,
          truckType: truck.truckType.truckType,
          union: truck.union.acronym,
          length: truck.length.truckLength,
          color: truck.color,
          stickerStaus: truck.stickerStatus,
          paymentStatus: truck.paymentStatus,
          stage: truck.stage,
          verificationStatus: truck.verificationStatus,
        };
        pendingVerifications.push(truckObjResp);
      }
    });
    return response(
      res,
      200,
      pendingVerifications,
      "trucks pending verification"
    );
  }

  static async addTruck(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      if (!req.file) {
        return response(res, 422, {}, "file not uploaded");
      }
      const imagePath = req.file;
      const truckNo = req.body.plateNo;
      const truckQrCode = await generateQrCode(truckNo);

      let addedTruckResult;
      const getTransporterDetail = await TruckModel.findOne({
        ownedBy: req.userId,
      });
      if (getTransporterDetail) {
        const checkExistence = getTransporterDetail.trucks.find((truck) => {
          if (
            truck.plateNo === truckNo ||
            truck.chasisNo === req.body.chasisNo
          ) {
            return response(
              res,
              409,
              "plate or chasis number already exists.",
              "validation error"
            );
          }
        });
        if (!checkExistence) {
          const imageResult = await cloudinary.uploader.upload(imagePath.path, {
            folder: "trucks",
          });
          getTransporterDetail.trucks.push({
            truckName: req.body.truckName,
            truckModel: req.body.truckModel,
            plateNo: truckNo,
            chasisNo: req.body.chasisNo,
            truckType: req.body.truckType,
            union: req.body.union,
            length: req.body.length,
            color: req.body.color,
            truckImage: imageResult.secure_url,
            qrCode: truckQrCode,
          });
          const updateOwnerTrucks = await getTransporterDetail.save();
          const mockResult = [];
          updateOwnerTrucks.trucks.map((truck) => {
            if (truck.plateNo === truckNo) {
              mockResult.push(truck);
            }
          });
          addedTruckResult = {
            _id: getTransporterDetail._id,
            ownedBy: getTransporterDetail.ownedBy,
            mockResult,
          };
          response(res, 201, addedTruckResult, "truck added");
        }
      } else {
        const imageResult = await cloudinary.uploader.upload(imagePath.path, {
          folder: "trucks",
        });
        const addedTruck = new TruckModel({
          ownedBy: req.userId,
          trucks: {
            truckName: req.body.truckName,
            truckModel: req.body.truckModel,
            plateNo: truckNo,
            chasisNo: req.body.chasisNo,
            truckType: req.body.truckType,
            union: req.body.union,
            length: req.body.length,
            color: req.body.color,
            truckImage: imageResult.secure_url,
            qrCode: truckQrCode,
          },
        });
        addedTruckResult = await addedTruck.save();
        response(res, 201, addedTruckResult, "truck added");
      }
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }
}

const generateQrCode = async (truckNo) => {
  try {
    const answer = await QRCode.toDataURL(
      `${process.env.URL}${process.env.BASE_URL}/lookup?truckref=${truckNo}`,
      { type: "image/png" }
    );
    return answer;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  uploader,
  TruckController,
};
