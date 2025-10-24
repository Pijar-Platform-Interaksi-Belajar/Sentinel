import axios from "axios";
import fs from "fs";

export const checkImage = async (filePath) => {
  const HF_API_URL = "https://api-inference.huggingface.co/models/google/vit-base-patch16-224"; // Contoh
  const HF_API_KEY = process.env.HF_API_KEY;

  try {
    const imageBuffer = fs.readFileSync(filePath);

    const response = await axios.post(
      HF_API_URL,
      imageBuffer,
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "image/*",
        },
      }
    );
    const results = response.data;

    let flagged = "SAFE";
    const unsafeLabel = results.find(r => r.label.toLowerCase().includes("unsafe") || r.label.toLowerCase().includes("inappropriate"));
    const threshold = 0.90;
    
    if (unsafeLabel && unsafeLabel.score > threshold) {
        flagged = "UNSAFE_CONTENT";
    }

    fs.unlinkSync(filePath);

    return {
      flagged,
      results,
    };
  } catch (error) {
    console.error("Error checkImage:", error.message);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    return { error: "Gagal memproses gambar" };
  }
};