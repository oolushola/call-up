const express = require("express");
const { isLoggedIn, isAdmin, isSuperAdmin } = require("../middleware/handlers");
const TerminalRoute = express.Router();
const TerminalController = require("../controllers/terminal/Terminal");
const validator = require("../middleware/validators/Terminal");

TerminalRoute.get("/terminals", isLoggedIn, TerminalController.getTerminals);

TerminalRoute.post(
  "/terminal/add",
  isLoggedIn,
  isAdmin,
  validator.ADD_TERMINAL,
  TerminalController.addTerminal
);

TerminalRoute.get(
  "/terminal/:terminalId",
  isLoggedIn,
  TerminalController.getTerminal
);

TerminalRoute.patch(
  "/terminal/:terminalId/park",
  isLoggedIn,
  isAdmin,
  validator.CHECK_PARK,
  TerminalController.addPark
);

TerminalRoute.delete(
  "/terminal/:terminalId/remove",
  isLoggedIn,
  isAdmin,
  validator.CHECK_PARK,
  TerminalController.removePark
);

module.exports = TerminalRoute;