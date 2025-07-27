const { State } = require("../schema/userschema");

// GET all states
const getStates = async (req, res) => {
  try {
    const states = await State.find(); 
    res.status(200).json(states);
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({
      message: "Error fetching states",
      error: error.message || error.toString(),
    });
  }
};
// POST new state
const createState = async (req, res) => {
  try {
    const newState = new State(req.body);
    const savedState = await newState.save();
    res.status(201).json(savedState);
  } catch (error) {
    res.status(400).json({ message: "Error creating state", error });
  }
};

// PUT update state by ID
const updateState = async (req, res) => {
  try {
    const updatedState = await State.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedState);
  } catch (error) {
    res.status(400).json({ message: "Error updating state", error });
  }
};

// DELETE state by ID
const deleteState = async (req, res) => {
  try {
    await State.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "State deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting state", error });
  }
};

module.exports = {
  getStates,
  createState,
  updateState,
  deleteState,
};
