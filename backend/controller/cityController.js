const { City } = require("../schema/userschema");

// GET all cities
const getCities = async (req, res) => {
  try {
    const cities = await City.find();
    res.status(200).json(cities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching cities", error: error.message });
  }
};

// POST a new city
const createCity = async (req, res) => {
  try {
    const newCity = new City(req.body);
    const savedCity = await newCity.save();
    res.status(201).json(savedCity);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating city", error: error.message });
  }
};

// PUT update city by ID
const updateCity = async (req, res) => {
  try {
    const updatedCity = await City.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedCity);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating city", error: error.message });
  }
};

// DELETE city by ID
const deleteCity = async (req, res) => {
  try {
    await City.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "City deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error deleting city", error: error.message });
  }
};

module.exports = {
  getCities,
  createCity,
  updateCity,
  deleteCity,
};
