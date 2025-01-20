import express from "express";
import mongoose from "mongoose";
import Netflix from "../models/Netflix.js";

const router = express.Router();

// Paginated route to get Netflix titles
router.get("/", async (req, res) => {
  try {
    // Get page and limit from query parameters with default values
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Fetch paginated titles and count total items
    const titles = await Netflix.find().skip(skip).limit(limit);
    const totalItems = await Netflix.countDocuments();

    // Send paginated response
    res.status(200).json({
      data: titles,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch titles", details: error.message });
  }
});

// Existing route to get a title by `show_id` or `_id`
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  let query = {};

  if (!isNaN(id)) {
    query = { show_id: parseInt(id) };
  } else if (mongoose.Types.ObjectId.isValid(id)) {
    query = { _id: id };
  } else {
    return res.status(400).json({ error: "Invalid ID format. Provide a numeric show_id or a valid MongoDB ObjectId." });
  }

  try {
    const title = await Netflix.findOne(query);
    if (!title) {
      return res.status(404).json({ error: "Title not found" });
    }

    res.json(title);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch title", details: error.message });
  }
});

export default router;
