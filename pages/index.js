import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchAndShowVideo = async () => {
    if (!url.trim()) {
      setError("⚠️ Please paste a video URL!");
      return;
    }

    setError("");
    setVideoInfo(null);
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/get-info?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error("Failed to fetch video info");
      const data = await res.json();
      setVideoInfo(data);
    } catch (err) {
      setError("❌ Failed to get video info.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch("https://d8856ba5-6ef9-4ba5-ac7e-23767b005e18-00-2esxzc9b3wr4y.sisko.replit.dev/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${videoInfo?.title || "video"}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("❌ Download failed.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-600 text-white flex flex-col items-center px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">🎬 SaveClip</h1>

      {/* If videoInfo NOT fetched, show box */}
      {!videoInfo && (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-2xl">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Download from YouTube, Instagram, Facebook
          </h2>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="Paste your video link here..."
              className="flex-1 p-3 rounded-lg bg-white text-black focus:outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              onClick={async () => {
                try {
                  const text = await navigator.clipboard.readText();
                  setUrl(text);
                } catch (err) {
                  alert("Clipboard access denied. Paste manually.");
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg font-semibold"
            >
              Paste
            </button>
          </div>

          {error && <p className="text-red-400 mb-3">{error}</p>}

          <button
            onClick={handleFetchAndShowVideo}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Fetching..." : "🔽 Download"}
          </button>
        </div>
      )}

      {/* Once videoInfo is fetched, show thumbnail + download button */}
      {videoInfo && (
        <div className="bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-xl text-center mt-6">
          <img
            src={videoInfo.thumbnail}
            alt="Video thumbnail"
            className="w-full rounded-lg mb-4"
          />
          <h3 className="text-lg font-semibold mb-4">{videoInfo.title}</h3>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-bold text-white w-full"
          >
            {downloading ? "Downloading..." : "⬇ Download Now"}
          </button>
        </div>
      )}
    </div>
  );
}
