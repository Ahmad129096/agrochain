const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Crop = require("../models/Crop");
const auth = require("../middleware/auth");

// Create a new order
router.post("/", auth, async (req, res) => {
  try {
    const { cropId, quantity } = req.body;

    // Get the crop
    const crop = await Crop.findById(cropId);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    // Check if crop is available
    if (crop.status !== "Available") {
      return res.status(400).json({ message: "Crop is not available" });
    }

    // Check if quantity is available
    if (crop.quantity < quantity) {
      return res
        .status(400)
        .json({ message: "Insufficient quantity available" });
    }

    // Calculate total price
    const totalPrice = crop.price * quantity;

    // Create new order
    const order = new Order({
      crop: cropId,
      buyer: req.user.id,
      farmer: crop.farmer,
      quantity,
      totalPrice,
      status: "Pending",
      paymentStatus: "Pending",
    });

    await order.save();

    // Update crop quantity
    crop.quantity -= quantity;
    if (crop.quantity === 0) {
      crop.status = "Sold";
    }
    await crop.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders for a buyer
router.get("/buyer", auth, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate("crop")
      .populate("farmer", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders for a farmer
router.get("/farmer", auth, async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user.id })
      .populate("crop")
      .populate("buyer", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (farmer only)
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is the farmer
    if (order.farmer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update payment status (buyer only)
router.patch("/:id/payment", auth, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is the buyer
    if (order.buyer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
