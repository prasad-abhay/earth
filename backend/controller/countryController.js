const { Country } = require("../schema/userschema");

// GET all countries
const getCountries = async (req, res) => {
  try {
    const countries = await Country.find();
    res.status(200).json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({
      message: "Error fetching countries",
      error: error.message || error.toString(),
    });
  }
};

// POST new country
const createCountry = async (req, res) => {
  try {
    const newCountry = new Country(req.body);
    const savedCountry = await newCountry.save();
    res.status(201).json(savedCountry);
  } catch (error) {
    res.status(400).json({ message: "Error creating country", error });
  }
};

// PUT update country by ID
const updateCountry = async (req, res) => {
  try {
    const updatedCountry = await Country.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    res.status(200).json(updatedCountry);
  } catch (error) {
    res.status(400).json({ message: "Error updating country", error });
  }
};

// DELETE country by ID
const deleteCountry = async (req, res) => {
  try {
    await Country.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Country deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting country", error });
  }
};

module.exports = {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
};
