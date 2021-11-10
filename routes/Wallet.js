const express = require('express') 
const WalletController = require('../controllers/Wallet')
const middleware = require('../middleware/handlers')
const validator = require('../middleware/validators/Wallet')

const Wallet = express.Router()

Wallet.get(
  '/user/wallet',
  middleware.isLoggedIn,
  middleware.walletPrivilege,
  WalletController.wallet
)

Wallet.post(
  '/fund-wallet',
  middleware.isLoggedIn,
  middleware.walletPrivilege,
  validator.CHECK_FUND,
  WalletController.fundWallet
)

Wallet.patch(
  '/update-transaction-history',
  middleware.isLoggedIn,
  middleware.walletPrivilege,
  validator.CHECK_DEBIT,
  WalletController.debitAccount
)

Wallet.post(
  '/transfer-wallet-fund',
  middleware.isLoggedIn,
  middleware.walletPrivilege,
  validator.CHECK_FUND,
  WalletController.transferFund
)

Wallet.get(
  '/user/transaction/history',
  middleware.isLoggedIn,
  middleware.walletPrivilege,
  WalletController.paymentHistory
)

Wallet.get(
  '/transaction/history/all',
  middleware.isLoggedIn,
  middleware.isAdmin,
  WalletController.allPaymentHistory
)

module.exports = Wallet