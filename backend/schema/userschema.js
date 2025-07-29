const { Schema, model } = require("mongoose");

// Country schema
const countrySchema = new Schema(
  {
    name: String,
    countryCode: String,
    createdBy: String,
    createDate: String,
  },
  { collection: "country" },
);

// State schema
const stateSchema = new Schema(
  {
    name: String,
    countryCode: String,
    createdBy: String,
    createDate: String,
  },
  { collection: "state" },
);

// City schema
const citySchema = new Schema(
  {
    name: String,
    countryCode: String,
    createdBy: String,
    createDate: String,
  },
  { collection: "city" },
);
// user schema
const userSchema = new Schema(
  {
    name: String,
    email: String,
    role: String,
    addedBy: String,
    dateAdded: String,
  },
  { collection: "user" },
);

// Create models
const Country = model("Country", countrySchema);
const State = model("State", stateSchema);
const City = model("City", citySchema);
const User = model("User", userSchema);

module.exports = { Country, State, City, User };
