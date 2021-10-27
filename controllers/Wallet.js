const WalletModel = require("../models/Wallet");
const { validationResult } = require("express-validator");
const { response } = require("../middleware/response");
require("dotenv").config();

class WalletController {
  static async fundWallet(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const { modeOfPayment } = req.body;
      const amountEntered = +req.body.amount;
      const commission = amountEntered * +process.env.CALL_UP_CHARGE;
      const amountPaid =
        amountEntered + amountEntered * +process.env.CALL_UP_CHARGE;
      let checkWalletRecord = await WalletModel.findOne({ userId: req.userId });
      if (checkWalletRecord) {
        checkWalletRecord.availableBalance += amountEntered;
        let creditHistory = [];
        checkWalletRecord["transactionHistory"].map((el) => {
          if (el.transactionType === "credit") {
            creditHistory.push(el);
          }
        });
        const amountLastDeposited =
          creditHistory[creditHistory.length - 1].amount;
        checkWalletRecord.lastDeposit = amountLastDeposited;
        checkWalletRecord["transactionHistory"].push({
          charges: +process.env.CALL_UP_CHARGE,
          amount: amountEntered,
          commission,
          amountPaid,
          transactionType: "credit",
          timestamp: Date.now(),
          modeOfPayment,
          ledgerBalance: checkWalletRecord.availableBalance,
        });
        const updateLedgerBalance = await checkWalletRecord.save();
        return response(res, 201, updateLedgerBalance, "wallet updated");
      }
      return response(res, 401, {}, "operation aborted");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async transferFund(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return response(res, 422, errors.mapped(), "validation failed");
      }
      const enteredAmount = +req.body.amount;
      const walletId = req.query.transferTo;
      const receiverWallet = await WalletModel.findById(walletId);
      if (receiverWallet) {
        const senderWallet = await WalletModel.findOne({ userId: req.userId });
        if (senderWallet.availableBalance < enteredAmount) {
          return response(res, 422, null, "insufficient balance");
        }
        senderWallet.availableBalance -=
          enteredAmount + enteredAmount * process.env.CALL_UP_CHARGE;
        const commission = enteredAmount * process.env.CALL_UP_CHARGE;
        senderWallet["transactionHistory"].push({
          charges: +process.env.CALL_UP_CHARGE,
          amount: enteredAmount,
          commission,
          amountPaid:
            enteredAmount + enteredAmount * process.env.CALL_UP_CHARGE,
          transactionType: "debit",
          timestamp: Date.now(),
          modeOfPayment: "transfer",
          ledgerBalance: senderWallet.availableBalance,
        });

        receiverWallet.availableBalance += enteredAmount;
        let creditHistory = [];
        receiverWallet.transactionHistory.map((el) => {
          if (el.transactionType === "credit") {
            creditHistory.push(el);
          }
        });
        const amountLastDeposited =
          creditHistory[creditHistory.length - 1].amount;
        receiverWallet.lastDeposit = amountLastDeposited;
        receiverWallet["transactionHistory"].push({
          charges: 0,
          amount: enteredAmount,
          commission: 0,
          amountPaid: enteredAmount,
          transactionType: "credit",
          timestamp: Date.now(),
          modeOfPayment: "transfer",
          ledgerBalance: receiverWallet.availableBalance,
        });
        await receiverWallet.save();
        const debitSender = await senderWallet.save();
        return response(
          res,
          200,
          {
            amountTransfered: enteredAmount,
            availableBalance: debitSender.availableBalance,
          },
          "transfer successful"
        );
      }
      response(res, 404, {}, "invalid wallet id");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async paymentHistory(req, res, next) {
    try {
      const userId = req.userId;
      const limiter = +req.query.limit || +process.env.PER_PAGE;
      const currentPage = +req.query.page || +process.env.CURRENT_PAGE;
      const paymentHistory = await WalletModel.findOne({ userId })
        .select(
          "-__v -lastDeposit -lastAmountSpent -transactionHistory.charges -transactionHistory.ledgerBalance -transactionHistory.commission"
        )
        .skip((currentPage - 1) * limiter)
        .limit(currentPage);
      const result = {
        walletId: paymentHistory._id,
        transactions: paymentHistory.transactionHistory,
        ledgerBalance: paymentHistory.availableBalance,
      };
      response(res, 200, result, "transaction history log");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }

  static async allPaymentHistory(req, res, next) {
    try {
      const limiter = +req.query.limit || +process.env.PER_PAGE;
      const currentPage = +req.query.page || +process.env.CURRENT_PAGE;
      const paymentHistory = await WalletModel.find()
        .populate('userId', 'name email')
        .select('-__v')
        .skip((currentPage - 1) * limiter)
        .limit(limiter);
      response(res, 200, paymentHistory, "transaction history log");
    } catch (err) {
      response(res, 500, err.message, "internal server error");
    }
  }
}

module.exports = WalletController;
