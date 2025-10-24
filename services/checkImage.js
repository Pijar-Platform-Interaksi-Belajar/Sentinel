import axios from "axios";
import fs from "fs"; // Import module File System built-in Node.js

export const checkImage = async (filePath) => {
  // Ganti URL model ini dengan model klasifikasi gambar yang sesuai di Hugging Face
  const HF_API_URL = "https://api-inference.huggingface.co/models/google/vit-base-patch16-224"; // Contoh
  const HF_API_KEY = process.env.HF_API_KEY;

  try {
    // 1. Baca file gambar menjadi Buffer
    const imageBuffer = fs.readFileSync(filePath);

    // 2. Kirim Buffer ke API Hugging Face
    const response = await axios.post(
      HF_API_URL,
      imageBuffer, // Kirim buffer sebagai body request
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "image/*", // Beri tahu API bahwa kita mengirim data gambar
        },
      }
    );

    // 3. Implementasikan logika flagging berdasarkan hasil (tergantung model)
    const results = response.data;
    
    // Contoh logika sederhana (kamu perlu menyesuaikan dengan output model yang kamu pakai)
    let flagged = "SAFE";
    
    // Asumsi: Jika ada label "not safe" dengan skor tinggi, kita flag
    const unsafeLabel = results.find(r => r.label.toLowerCase().includes("unsafe") || r.label.toLowerCase().includes("inappropriate"));
    const threshold = 0.90; // Contoh threshold tinggi
    
    if (unsafeLabel && unsafeLabel.score > threshold) {
        flagged = "UNSAFE_CONTENT";
    }

    // 4. Hapus file lokal setelah selesai diproses (PENTING!)
    fs.unlinkSync(filePath);

    return {
      flagged,
      results,
    };
  } catch (error) {
    console.error("Error checkImage:", error.message);
    // Pastikan file dihapus jika terjadi error di tengah proses
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    return { error: "Gagal memproses gambar" };
  }
};