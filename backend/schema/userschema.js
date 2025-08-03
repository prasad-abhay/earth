const { Schema, model } = require("mongoose");

// Country schema
const countrySchema = new Schema(
  {
    name: { type: String, require: true },
    code: { type: String, require: true },
    createdBy: { type: String, require: true },
    createdDate: { type: String, require: true },
  },
  { collection: "country" },
);

// State schema
const stateSchema = new Schema(
  {
    name: { type: String, require: true },
    code: { type: String, require: true },
    countryName: { type: String, require: true },
    createdBy: { type: String, require: true },
    createdDate: { type: String, require: true },
  },
  { collection: "state" },
);

// City schema
const citySchema = new Schema(
  {
    name: { type: String, require: true },
    code: { type: String, require: true },
    stateName: { type: String, require: true },
    countryName: { type: String, require: true },
    countryId: { type: String, require: true },
    createdBy: { type: String, require: true },
    createdDate: { type: String, require: true },
  },
  { collection: "city" },
);
// user schema
const userSchema = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true },
    role: { type: String, require: true },
    addedBy: { type: String, require: true },
    dateAdded: { type: String, require: true },
  },
  { collection: "user" },
);

// Create models
const Country = model("Country", countrySchema);
const State = model("State", stateSchema);
const City = model("City", citySchema);
const User = model("User", userSchema);

module.exports = { Country, State, City, User };
