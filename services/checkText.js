import axios from "axios";

export const checkText = async (text) => {
  try {
    const HF_API_URL = "https://api-inference.huggingface.co/models/unitary/toxic-bert";
    const HF_API_KEY = process.env.HF_API_KEY;

    const response = await axios.post(
      HF_API_URL,
      { inputs: text },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );

    const results = response.data[0];
    const threat = results.find(r => r.label.toLowerCase().includes("threat"));
    const insult = results.find(r => r.label.toLowerCase().includes("insult"));

    const threshold = 0.05;
    let flagged = "SAFE";

    if (threat && threat.score > threshold) {
      flagged = "THREAT";
    } else if (insult && insult.score > threshold) {
      flagged = "INSULT";
    }

    return {
      flagged,
      results: results.map(r => ({
        label: r.label,
        score: r.score,
      })),
    };
  } catch (error) {
    console.error("Error checkText:", error.message);
    return { error: "Gagal memproses teks" };
  }
};
