const TruckUnionModel = require("../../../models/admin/preferences/TruckUnion");
const WalletModel = require("../../../models/Wallet")
const BookingModel = require("../../../models/BookingModel")
const { validationResult } = require("express-validator");
const { response } = require("../../../middleware/response");

class TruckUnionController {
  static async allTruckUnions(_, res, _2) {
    try {
      const truckUnions = await TruckUnionModel.find()
        .select("-__v -createdAt -updatedAt")
        .sort({ acronym: "asc" });
      response(res, 200, truckUnions, "truck unions");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async getAccountUnion(req, res, _) {
    try {
      const userId = req.userId;
      const userUnion = await TruckUnionModel.findOne({
        ownedBy: userId,
      }).select("-__v -createdAt -updatedAt");
      if (userUnion) {
        return response(res, 200, userUnion, `${userUnion.acronym} details`);
      }
      response(res, 404, null, "resource not found");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async getTruckUnion(req, res, _2) {
    try {
      const truckUnionId = req.params.truckUnionId;
      const checkTruckUnion = await TruckUnionModel.findById(
        truckUnionId
      ).select("-__v -createdAt -updatedAt");
      if (checkTruckUnion) {
        return response(
          res,
          200,
          checkTruckUnion,
          `${checkTruckUnion.acronym} details`
        );
      }
      response(res, 404, null, "resource not found");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async AddTruckUnion(req, res, _) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { name, acronym, contact } = req.body;
      const checkAcronym = await TruckUnionModel.findOne({
        ownedBy: req.userId,
      }).countDocuments();
      if (checkAcronym > 0) {
        return response(res, 409, null, "an acronym already exists");
      }
      const truckUnion = new TruckUnionModel({
        ownedBy: req.userId,
        name: name,
        acronym,
        contact: contact,
      });
      const saveTruckUnion = await truckUnion.save();
      response(res, 201, saveTruckUnion, "truck union added");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async updateTruckUnion(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { name, acronym, contact } = req.body;

      const { truckUnionId } = req.params;
      const checkRecord = await TruckUnionModel.findOne({
        _id: { $ne: truckUnionId },
      }).where({
        acronym: acronym,
      });
      if (checkRecord)
        return response(res, 409, null, `${checkRecord.acronym} exists`);
      const updatedRecord = await TruckUnionModel.findByIdAndUpdate(
        {
          _id: truckUnionId,
        },
        {
          name: name,
          acronym: acronym,
          contact: contact,
        }
      );
      console.log(updatedRecord);
      response(
        res,
        201,
        updatedRecord,
        `${updatedRecord.acronym} updated successfully`
      );
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async removeTruckUnion(req, res, _) {
    const { truckUnionId } = req.params;
    try {
      const truckUnion = await TruckUnionModel.findById(truckUnionId);
      if (!truckUnion) {
        return response(res, 404, {}, "resource not found");
      }
      const deletedRecord = await truckUnion.remove();
      response(res, 200, deletedRecord, "record deleted");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async unionOverview(req, res, next) {
    try {
      const unionWallet = await WalletModel.findOne({ userId: req.userId });
      const generatedRevenue = unionWallet.transactionHistory
        .map((wallet) => wallet.amount)
        .reduce((sum, val) => sum + val, 0);

      const pendingPayments = unionWallet.transactionHistory.map(transaction => {
        if (!transaction.ownerPaid && transaction.transactionStatus === 'success') {
          return transaction.amount
        }
      }).reduce((sum, val) => sum + val, 0)

      const receivedPayments = unionWallet.transactionHistory.map(transaction => {
        if (transaction.ownerPaid) {
          return transaction.amount
        }
        else {
          return 0;
        }
      }).reduce((sum, val) => sum + val, 0)

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
        const amountGenerated = unionWallet.transactionHistory.filter(
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
          pendingPayments,
          generatedRevenue,
          revenue,
          days,
          lastReceived: unionWallet.lastReceived,
          receivedPayments,
        },
        "park overview"
      );
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }
}

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

module.exports = TruckUnionController;
