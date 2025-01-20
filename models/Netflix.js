import mongoose from "mongoose";

const NetflixSchema = new mongoose.Schema({
  show_id: { type: Number, unique: true, required: true },
  title: { type: String, required: true },
  director: { type: String, default: "Unknown" },
  cast: [{ type: String, default: [] }],
  country: { type: String, default: "Unknown" },
  date_added: { type: Date, default: null },
  release_year: { type: Number, required: true },
  rating: { type: String, default: "Unrated" },
  duration: { type: String, default: "Unknown" },
  listed_in: [{ type: String, default: [] }],
  description: { type: String, required: true },
  type: { type: String, enum: ["Movie", "TV Show"], required: true },
});

const Netflix = mongoose.model("Movies", NetflixSchema);
export default Netflix;
