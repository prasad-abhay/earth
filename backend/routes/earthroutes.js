const express = require("express");
const router = express.Router();

const {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
} = require("../controller/countryController");

const {
  getStates,
  createState,
  updateState,
  deleteState,
} = require("../controller/stateController");

const {
  getCities,
  createCity,
  updateCity,
  deleteCity,
} = require("../controller/cityController");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controller/userController");

// COUNTRY Routes
router.get("/country", (req, res) => {
  getCountries(req, res);
});

router.post("/country", (req, res) => {
  createCountry(req, res);
});

router.put("/country/:id", (req, res) => {
  updateCountry(req, res);
});

router.delete("/country/:id", (req, res) => {
  deleteCountry(req, res);
});

// STATE Routes
router.get("/state", (req, res) => {
  getStates(req, res);
});

router.post("/state", (req, res) => {
  createState(req, res);
});

router.put("/state/:id", (req, res) => {
  updateState(req, res);
});

router.delete("/state/:id", (req, res) => {
  deleteState(req, res);
});

// CITY routes
router.get("/city", (req, res) => {
  getCities(req, res);
});

router.post("/city", (req, res) => {
  createCity(req, res);
});

router.put("/city/:id", (req, res) => {
  updateCity(req, res);
});

router.delete("/city/:id", (req, res) => {
  deleteCity(req, res);
});

// USER routes
router.get("/user", (req, res) => {
  getUsers(req, res);
});

router.post("/user", (req, res) => {
  createUser(req, res);
});

router.put("/user/:id", (req, res) => {
  updateUser(req, res);
});

router.delete("/user/:id", (req, res) => {
  deleteUser(req, res);
});


module.exports = router;
