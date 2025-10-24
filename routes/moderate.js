import express from "express";
import multer from 'multer';                 
import { checkText } from "../services/checkText.js";
import { checkImage } from '../services/checkImage.js';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

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

router.post("/image", upload.single('image'), async (req, res) => {
    try {
        const file = req.file;

        if(!file) {
            return res.status(400).json({ error: "File gambar tidak ditemukan" })
        }
        
        const result = await checkImage(file.path)

        res.json(result)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal memproses gambar" });
    }
});

export default router;