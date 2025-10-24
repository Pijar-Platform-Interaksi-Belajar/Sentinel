import express from "express";
import { checkText } from "../services/checkText.js";

const router = express.Router();

// endpoint /moderate/text
router.post("/text", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Teks tidak boleh kosong" });

    const result = await checkText(text);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal memproses teks" });
  }
});

export default router;
