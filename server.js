import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Netflix from "./models/Netflix.js"; // Ensure correct file path
import netflixRoutes from "./routes/netflix.js"; // Ensure correct file path

dotenv.config();

// Connect to MongoDB
const connectToDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri, { autoIndex: true });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

const app = express();
const port = process.env.PORT || 3000;

connectToDB();

app.use(cors());
app.use(express.json());

// Seed database if RESET_DB is true
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    try {
      await Netflix.deleteMany({});
      // Add your netflixData import and seeding logic here if needed
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
    <p>Welcome to the Netflix Titles API. Here are the available endpoints:</p>
    <ul>
      <li><a href="/titles">/titles</a> - Get all Netflix titles with pagination</li>
      <li><a href="/titles/:id">/titles/:id</a> - Get a single Netflix title by ID</li>
    </ul>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
