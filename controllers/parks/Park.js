const ParkModel = require("../../models/Parks/park");
const TerminalModel = require("../../models/terminals/Terminal");
const TruckUnionModel = require("../../models/admin/preferences/TruckUnion");
const WalletModel = require("../../models/Wallet");
const BookingModel = require("../../models/BookingModel");
const TruckModel = require("../../models/transporter/truck");
const { validationResult } = require("express-validator");
const { response } = require("../../middleware/response");
const multer = require("multer");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;

const filefilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(false, null);
  }
};

const upload = multer({ dest: "uploads/", fileFilter: filefilter }).single(
  "parkImage"
);

class ParkController {
  static async getHoldingBayParks(req, res, next) {
    try {
      const parks = await ParkModel.find({
        parkType: "Holding Bay",
        parkStatus: true,
      })
        .select(
          "-createdAt, -updatedAt -entryGateSerialNo -exitGateSerialNo -parkType -allowedTerminals"
        )
        .populate("features.featureId profileType", "feature category");
      return response(res, 200, parks, "holding bays");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async allParks(req, res, next) {
    try {
      const limit = req.query.limit || process.env.PER_PAGE;
      const currentPage = req.query.page || process.env.CURRENT_PAGE;
      const skip = (currentPage - 1) * currentPage;
      const allParks = await ParkModel.find()
        .populate("profileType features.featureId", "category feature")
        .sort({ name: "asc" })
        .skip(skip)
        .limit(limit);
      response(res, 200, allParks, "all parks");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async userPark(req, res, next) {
    try {
      const limit = req.query.limit || process.env.PER_PAGE;
      const currentPage = req.query.page || process.env.CURRENT_PAGE;
      const skip = (currentPage - 1) * currentPage;
      const userParks = await ParkModel.find({ owner: req.userId })
        .populate("profileType features.featureId", "category feature")
        .sort({ name: "asc" })
        .skip(skip)
        .limit(limit);
      response(res, 200, userParks, "user parks");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async addParks(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const referenceNo = crypto.randomBytes(10).toString("hex");
      const entryGateSerialNo = generateSerial();
      const exitGateSerialNo = generateSerial();
      let parkImage;
      if (req.file) {
        parkImage = await cloudinary.uploader.upload(req.file.path, {
          folder: "parks",
        });
      }
      const {
        name,
        capacity,
        type,
        parkStatus,
        features,
        phoneNos,
        location,
        parkType,
        allowedTerminals,
      } = req.body;

      const contact = {
        phoneNos: JSON.parse(phoneNos),
        address: location,
      };

      const parkTypes = JSON.parse(parkType);

      let userAllowedTerminals = JSON.parse(allowedTerminals);
      let terminals = [];
      userAllowedTerminals.map((terminal) => {
        terminals.push(terminal.id);
      });

      const parkInstance = new ParkModel({
        owner: req.userId,
        referenceNo: referenceNo,
        name: name,
        capacity: capacity,
        profileType: type,
        parkStatus: parkStatus,
        availableSlot: capacity,
        contact: contact,
        parkImage: parkImage.secure_url,
        parkType: parkTypes,
        entryGateSerialNo: entryGateSerialNo,
        exitGateSerialNo: exitGateSerialNo,
        features: JSON.parse(features),
        allowedTerminals: terminals,
      });
      const saveParkInstance = await parkInstance.save();

      await terminals.map(async (terminalId) => {
        const terminal = await TerminalModel.findOne({ _id: terminalId });
        terminal.parks.push(parkInstance._id);
        await terminal.save();
      });

      response(res, 201, saveParkInstance, "park added");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async verifyJourneyCode(req, res, next) {
    const { journeyCode, bookingId } = req.query;
    try {
      const bookingInfo = await BookingModel.findById(bookingId);
      const userParks = await ParkModel.find({ ownedBy: req.userId }).select(
        "_id"
      );
      const checkPark = userParks.findIndex((park) => {
        return park._id.toString() === bookingInfo.parkId.toString();
      });
      if (checkPark < 0) {
        return response(res, 401, "unauthorized", "operation aborted");
      }
      //come back to check for ticket validity.

      if (journeyCode !== bookingInfo.journeyCode) {
        return response(res, 422, "unprocessible entity", "match failed");
      }
      response(res, 200, "match complete", "successful");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async verifyGateEntrySerialNo(req, res, next) {
    try {
      const { bookingId, entryGateSerialNo } = req.query;
      const bookingInfo = await BookingModel.findById(bookingId);
      const userParks = await ParkModel.find({ ownedBy: req.userId }).select(
        "_id entryGateSerialNo"
      );
      const parkIndex = userParks.findIndex((park) => {
        return park._id.toString() === bookingInfo.parkId.toString();
      });
      if (parkIndex < 0) {
        return response(res, 401, "operation denied", "failed");
      }
      const parkEntryGateSerialNo = userParks[parkIndex].entryGateSerialNo;
      if (parkEntryGateSerialNo !== entryGateSerialNo) {
        return response(res, 422, "unprocessible entity", "failed");
      }
      response(res, 200, "valid", "successful");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async verifyExitSerialNo(req, res, next) {
    try {
      const { bookingId, exitSerialNo } = req.query;
      const bookingInfo = await BookingModel.findById(bookingId);
      const userParks = await ParkModel.find({ ownedBy: req.userId }).select(
        "_id exitGateSerialNo"
      );
      const parkIndex = userParks.findIndex((park) => {
        return park._id.toString() === bookingInfo.parkId.toString();
      });
      if (parkIndex < 0) {
        return response(res, 401, "operation denied", "failed");
      }
      const parkExitSerialNo = userParks[parkIndex].exitGateSerialNo;
      if (parkExitSerialNo !== exitSerialNo) {
        return response(res, 422, "unprocessible entity", "failed");
      }
      response(res, 200, "valid", "successful");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async grantTruckEntry(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { journeyCode } = req.body;
      const bookingId = req.query.bookingId;
      const bookingInfo = await BookingModel.findById(bookingId);
      if (bookingInfo.holdingBayActivity.inParkStatus) {
        return response(res, 409, "conflict", "truck already in park");
      }

      const userTrucks = await TruckModel.findOne({
        ownedBy: bookingInfo.ownedBy,
      });
      const getTruckIndex = userTrucks.trucks.findIndex(
        (truck) => truck._id.toString() === bookingInfo.truckId.toString()
      );

      bookingInfo.inParkStatus = true;
      bookingInfo.holdingBayActivity.checkedInBy = req.userId;
      bookingInfo.holdingBayActivity.checkIn = Date.now();
      bookingInfo.holdingBayActivity.inParkStatus = true;

      const parkInfo = await ParkModel.findById(bookingInfo.parkId);
      parkInfo.availableSlot = parkInfo.capacity - 1;

      const parkOwnerWallet = await updateWallet(
        req.userId,
        5000,
        `Access entry for journey code: ${journeyCode}`
      );
      if (getTruckIndex >= 0) {
        userTrucks.trucks[getTruckIndex].availableForCallUp = false;
        await userTrucks.save();
        const unionInfo = await TruckUnionModel.findById(
          userTrucks.trucks[getTruckIndex].union
        );
        const unionWallet = await updateWallet(
          unionInfo.ownedBy,
          50,
          `Commission for Truck No: ${userTrucks.trucks[getTruckIndex].plateNo}`
        );
        await unionWallet.save();
      }

      await bookingInfo.save();
      await parkInfo.save();
      await parkOwnerWallet.save();

      response(res, 201, "access granted", "success");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async grantTruckExit(req, res, next) {
    const bookingId = req.query.bookingId;
    try {
      const bookingInfo = await BookingModel.findById(bookingId);
      bookingInfo.holdingBayActivity.inParkStatus = false;
      bookingInfo.holdingBayActivity.outOfParkStatus = true;
      (bookingInfo.holdingBayActivity.checkedOut = Date.now()),
        (bookingInfo.holdingBayActivity.checkedOutBy = req.userId);

      const parkInfo = await ParkModel.findById(bookingInfo.parkId);
      parkInfo.availableSlot += 1;
      await parkInfo.save();
      await bookingInfo.save();
      response(res, 201, "checked out", "successful");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async parkOverview(req, res, next) {
    try {
      const parkWallet = await WalletModel.findOne({ userId: req.userId });
      const generatedRevenue = parkWallet.transactionHistory
        .map((wallet) => wallet.amount)
        .reduce((sum, val) => sum + val, 0);
      const expectedTrips = await BookingModel.find({
        parkId: req.userId,
        paymentStatus: true,
        bookingStatus: true,
        "holdingbayActivities.inParkStatus": false,
      }).countDocuments();

      const currentDay = new Date().getDate();
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const month = monthName(currentMonth);

      let revenue = [];
      let days = [];

      for (let day = 1; day <= currentDay; day += 1) {
        let actualDay;
        day < 9 ? (actualDay = `0${day}`) : (actualDay = day);

        const date = `${currentYear}-${currentMonth}-${actualDay}`;
        const amountGenerated = parkWallet.transactionHistory.filter(
          (wallet) => {
            return wallet.timestamp.toISOString().substr(0, 10) === date;
          }
        );
        const totalValuAccrued = amountGenerated
          .map((charge) => charge.amount)
          .reduce((sum, val) => sum + val, 0);
        revenue.push(totalValuAccrued / 1000);
        days.push(`${month} ${ordinalNumbers(day)}`);
      }
      response(
        res,
        200,
        {
          expectedTrips,
          generatedRevenue,
          revenue,
          days,
          lastReceived: parkWallet.lastReceived,
        },
        "park overview"
      );
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }
}

const updateWallet = async (owner, amount, description) => {
  const wallet = await WalletModel.findOne({ userId: owner });
  wallet.availableBalance += amount;
  wallet.lastDeposit = amount;
  wallet.transactionHistory.push({
    charges: 0,
    transactionStatus: "success",
    amount: amount,
    commission: 0,
    amountPaid: amount,
    transactionType: "credit",
    timestamp: Date.now(),
    modeOfPayment: "call-up wallet",
    transanctionReference: generateSerial(),
    paymentFor: description,
  });
  return wallet;
};

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

const monthName = (month) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month - 1];
};

const ordinalNumbers = (number) => {
  let suffix = ["th", "st", "nd", "rd"],
    variation = number % 100;
  return (
    number + (suffix[(variation - 20) % 10] || suffix[variation] || suffix[0])
  );
};

const dateDifference = (initialDate, comparator) => {
  const utc1 = Date.UTC(
    initialDate.getFullYear(),
    initialDate.getMonth(),
    initialDate.getDate()
  );
  const utc2 = Date.UTC(
    comparator.getFullYear(),
    comparator.getMonth(),
    comparator.getDate()
  );
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

const generateSerial = () => {
  let chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    serialLength = 10,
    randomSerial = "",
    i,
    randomNumber;
  for (i = 0; i < serialLength; i = i + 1) {
    randomNumber = Math.floor(Math.random() * chars.length);
    randomSerial += chars
      .substring(randomNumber, randomNumber + 1)
      .toLowerCase();
  }
  return randomSerial;
};

module.exports = {
  upload,
  ParkController,
};
