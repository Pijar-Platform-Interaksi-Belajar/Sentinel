import express from "express";
import dotenv from "dotenv";
import textRoute from "./routes/textRoute.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/moderate", textRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Sentinel running at http://localhost:${PORT}`);
});
