import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setImage(null);
    try {
      const res = await axios.post("/api/generate", { prompt });
      setImage(res.data.url);
    } catch (err) {
      console.error(err);
      alert("Error generating image.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Crypto Meme Generator 🧠📈</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your crypto prompt"
        className="p-2 w-full max-w-lg mb-4 text-black rounded"
      />
      <button
        onClick={generateImage}
        className="bg-green-500 px-4 py-2 rounded text-black font-bold disabled:opacity-50"
        disabled={loading || !prompt}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {image && (
        <img
          src={image}
          alt="Generated meme"
          className="mt-6 max-w-full border rounded"
        />
      )}
    </div>
  );
}