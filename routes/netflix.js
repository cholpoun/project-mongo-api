import express from "express";
import mongoose from "mongoose";
import Netflix from "../models/Netflix.js";

const router = express.Router();

// Get all Netflix titles
router.get("/", async (req, res) => {
  try {
    const titles = await Netflix.find(); // Fetch all titles
    res.status(200).json(titles);        // Return titles as JSON
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch titles", details: error.message });
  }
});

// Get a title by `show_id` or `_id`
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  let query = {};

  if (!isNaN(id)) {
    // If `id` is numeric, assume it's a `show_id`
    query = { show_id: parseInt(id) };
  } else if (mongoose.Types.ObjectId.isValid(id)) {
    // If `id` is a valid MongoDB ObjectId, query by `_id`
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
