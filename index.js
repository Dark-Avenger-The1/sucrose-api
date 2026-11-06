import express from "express";
import cors from "cors";
import router from "./routes.js";
import rateLimit from "express-rate-limit";

import path from "node:path";
import { fileURLToPath } from "node:url";
const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set('trust proxy', 1);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,               // 100 requests per IP per window
  standardHeaders: 'draft-7', // sends RateLimit-* headers
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use(globalLimiter);

// after app.use("/api", router):


app.use(express.static(path.join(__dirname, "src", "public")));

app.use(cors());
app.use(express.json());

app.use("/api", router);

// Unknown routes
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Errors passed with next(err) from your handle() wrapper
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
    console.log(`Model ready and running on port ${PORT}`);
});