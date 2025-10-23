import express from "express";
import { checkText } from "../services/checkText.js";

const router = express.Router();

router.post("/text", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Field 'text' tidak boleh kosong" });
  }

  try {
    const data = await checkText(text);

    const highRiskLabels = data[0]
      .filter((item) => item.score > 0.7)
      .map((item) => item.label.toUpperCase());

    const summary = highRiskLabels.length > 0 ? highRiskLabels.join(" / ") : "SAFE";

    res.json({
      flagged: highRiskLabels.length > 0,
      summary,
      labels: data[0],
    });
  } catch (error) {
    console.error("Moderation error:", error);
    res.status(500).json({ error: "Gagal memproses teks" });
  }
});

export default router;
