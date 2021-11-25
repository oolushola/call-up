const express = require("express");
const routes = express.Router();
const AuthRoute = require("./Auth");

const TruckUnionRoute = require("./admin/preference/TruckUnion");
const UserTypeRoute = require("./admin/preference/UserType");
const Category = require("./admin/preference/Category");
const BookingCategory = require("./admin/preference/BookingCategory");
const ParkFeature = require("./admin/preference/ParkFeatures");
const TruckType = require("./admin/preference/TruckType");
const TruckLength = require("./admin/preference/TruckLength");

const AddOnService = require("./admin/finance/AddOnService");
const TruckCharge = require("./admin/finance/TruckCharge");
const ParkCharge = require("./admin/finance/ParkCharge");

const Wallet = require("./Wallet");
const Truck = require("./Truck");
const Park = require("./Park");
const Terminal = require("./Terminal");
const uploadTdoRoute = require('./UploadTdo')
const BookingRoute = require('./Booking')

routes.use(process.env.BASE_URL, [
  AuthRoute,
  TruckUnionRoute,
  UserTypeRoute,
  Category,
  TruckCharge,
  ParkCharge,
  TruckType,
  TruckLength,
  Wallet,
  Truck,
  ParkFeature,
  Park,
  BookingCategory,
  Terminal,
  AddOnService,
  uploadTdoRoute,
  BookingRoute
]);

module.exports = routes;
