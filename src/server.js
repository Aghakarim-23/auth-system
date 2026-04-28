import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";


dotenv.config();

connectDB();


const app = express();
const PORT = process.env.PORT || 8001;
app.use(
  cors({
    origin: ["https://agas-exam-app.netlify.app", "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());


app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});