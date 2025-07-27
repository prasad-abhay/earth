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
  console.log("GET /country hit");
  getCountries(req, res);
});

router.post("/country", (req, res) => {
  console.log("POST /country hit");
  createCountry(req, res);
});

router.put("/country/:id", (req, res) => {
  console.log("PUT /country/:id hit");
  updateCountry(req, res);
});

router.delete("/country/:id", (req, res) => {
  console.log("DELETE /country/:id hit");
  deleteCountry(req, res);
});

// STATE Routes
router.get("/state", (req, res) => {
  console.log("GET /state hit");
  getStates(req, res);
});

router.post("/state", (req, res) => {
  console.log("POST /state hit");
  createState(req, res);
});

router.put("/state/:id", (req, res) => {
  console.log("PUT /state/:id hit");
  updateState(req, res);
});

router.delete("/state/:id", (req, res) => {
  console.log("DELETE /state/:id hit");
  deleteState(req, res);
});

// CITY routes
router.get("/city", (req, res) => {
  console.log("GET /city hit");
  getCities(req, res);
});

router.post("/city", (req, res) => {
  console.log("POST /city hit");
  createCity(req, res);
});

router.put("/city/:id", (req, res) => {
  console.log("PUT /city/:id hit");
  updateCity(req, res);
});

router.delete("/city/:id", (req, res) => {
  console.log("DELETE /city/:id hit");
  deleteCity(req, res);
});

// USER routes
router.get("/user", (req, res) => {
  console.log("GET /user hit");
  getUsers(req, res);
});

router.post("/user", (req, res) => {
  console.log("POST /user hit");
  createUser(req, res);
});

router.put("/user/:id", (req, res) => {
  console.log("PUT /user/:id hit");
  updateUser(req, res);
});

router.delete("/user/:id", (req, res) => {
  console.log("DELETE /user/:id hit");
  deleteUser(req, res);
});


module.exports = router;
