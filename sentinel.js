import express from "express";
import dotenv from "dotenv";
import moderateRoutes from "./routes/moderate.js";

dotenv.config();
const app = express();
app.use(express.json());

app.use("/moderate", moderateRoutes);

app.listen(3000, () => console.log("✅ Server jalan di http://localhost:3000"));
