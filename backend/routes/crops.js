const express = require("express");
const router = express.Router();
const Crop = require("../models/Crop");
const auth = require("../middleware/auth");

// Get all available crops
router.get("/", async (req, res) => {
  try {
    const crops = await Crop.find({ status: "Available" }).populate(
      "farmer",
      "name email location"
    );
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get crops for a specific farmer
router.get("/farmer", auth, async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.user.id });
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new crop listing
router.post("/", auth, async (req, res) => {
  try {
    const { name, quantity, price } = req.body;

    const crop = new Crop({
      name,
      quantity,
      price,
      farmer: req.user.id,
      status: "Available",
    });

    await crop.save();
    res.status(201).json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a crop listing
router.patch("/:id", auth, async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    // Check if user is the farmer
    if (crop.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, quantity, price, status } = req.body;

    if (name) crop.name = name;
    if (quantity) crop.quantity = quantity;
    if (price) crop.price = price;
    if (status) crop.status = status;

    await crop.save();
    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a crop listing
router.delete("/:id", auth, async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    // Check if user is the farmer
    if (crop.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await crop.deleteOne();
    res.json({ message: "Crop deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
