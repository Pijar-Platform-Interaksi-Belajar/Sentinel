import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const HF_TOKEN = process.env.HF_TOKEN;

export async function checkText(content) {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/unitary/toxic-bert",
      { inputs: content },
      {
        headers: { Authorization: `Bearer ${HF_TOKEN}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error saat cek teks:", error.message);
    throw new Error("Gagal memproses teks di Hugging Face");
  }
}
