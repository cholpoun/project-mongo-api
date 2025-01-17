import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import netflixData from "./data/netflix-titles.json";
import Netflix from "./models/Netflix";
import netflixRoutes from "./routes/netflix";


dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

// Seed database if RESET_DB is true
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    try {
      await Netflix.deleteMany({});
      const formattedData = netflixData.map((item) => ({
        show_id: item.show_id,
        title: item.title,
        director: item.director || "Unknown",
        cast: item.cast ? item.cast.split(", ") : [],
        country: item.country || "Unknown",
        date_added: item.date_added ? new Date(item.date_added) : null,
        release_year: item.release_year,
        rating: item.rating || "Unrated",
        duration: item.duration || "Unknown",
        listed_in: item.listed_in ? item.listed_in.split(", ") : [],
        description: item.description,
        type: item.type,
      }));

      await Netflix.insertMany(formattedData);
      console.log("Database seeded successfully!");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  };
  seedDatabase();
}

// Use Netflix routes
app.use("/titles", netflixRoutes);

// Documentation endpoint
app.get("/", (req, res) => {
  res.send(`
    <h1>Netflix Titles API</h1>
    <p>Welcome to the Netflix Titles API. Available endpoints:</p>
    <ul>
      <li><a href="/titles">/titles</a> - Get all Netflix titles</li>
      <li><a href="/titles/:id">/titles/:id</a> - Get a single Netflix title by ID</li>
    </ul>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});