const express = require("express");
const { isLoggedIn, isAdmin, isSuperAdmin } = require("../middleware/handlers");
const TerminalRoute = express.Router();
const TerminalController = require("../controllers/terminal/Terminal");
const validator = require("../middleware/validators/Terminal");

TerminalRoute.get("/terminals", isLoggedIn, TerminalController.getTerminals);


TerminalRoute.get(
  "/user-terminal",
  isLoggedIn,
  TerminalController.getUserTerminal
);

TerminalRoute.post(
  "/terminal/add",
  isLoggedIn,
  validator.ADD_TERMINAL,
  TerminalController.addTerminal
);

TerminalRoute.put(
  '/terminal/:terminalId',
  isLoggedIn,
  validator.UPDATE_TERMINAL,
  TerminalController.updateTerminal
)

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

TerminalRoute.patch(
  "/terminal/:terminalId/daily-capacity",
  isLoggedIn,
  TerminalController.updateDailyCapacity
)

TerminalRoute.patch(
  "/terminal/:terminalId/empty-capacity",
  isLoggedIn,
  TerminalController.updateEmptyCapacity
)

TerminalRoute.delete(
  "/terminal/:terminalId/remove",
  isLoggedIn,
  isAdmin,
  validator.CHECK_PARK,
  TerminalController.removePark
);

module.exports = TerminalRoute;
