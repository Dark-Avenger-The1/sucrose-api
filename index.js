import express from "express";
import cors from "cors";
import router from "./routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

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