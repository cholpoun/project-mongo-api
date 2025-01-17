import mongoose from "mongoose";
import express from "express";
import Netflix from "../models/Netflix";

const router = express.Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const title = await Netflix.findById(id);
    if (!title) {
      return res.status(404).json({ error: "Title not found" });
    }

    res.json(title);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch title", details: error.message });
  }
});

export default router;
