"use client";
import { useState } from "react";
import Head from "next/head";

type KanjiInfo = {
  level: number;
  meaning: string[];
  on: string[];
  kun: string[];
};

export default function HomePage() {
  // the text input, the API response, error message and whether we are in reader mode
  const [text, setText] = useState<string>("");
  const [kanjiOutput, setKanjiOutput] = useState<Record<string, KanjiInfo> | null>(null);
  const [error, setError] = useState<string>("");
  const [showReader, setShowReader] = useState<boolean>(false);

  // When the user clicks Search, we call the backend API
  // and then transition to reader mode (if the fetch succeeds)
  const handleSearch = async () => {
    if (text.trim() === "") {
      setError("Please enter some text");
      return;
    }
    try {
      setError("");
      // Note: the API call should URL-encode the text
      const response = await fetch(`http://127.0.0.1:8000/kanji-info?text=${encodeURIComponent(text)}`);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      setKanjiOutput(data);
      setShowReader(true);
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    }
  };

  // Resets the state for a new search
  const handleNewSearch = () => {
    setText("");
    setKanjiOutput(null);
    setError("");
    setShowReader(false);
  };

  /**
   * Splits the input text into nonempty lines and for each line creates a two‐column
   * display: the left side shows the original text and the right side shows any found
   * kanji details.
   */
  function renderFormattedOutput(
    inputText: string,
    kanjiData: Record<string, KanjiInfo>
  ) {
    // Split into lines and filter out blank lines
    const lines = inputText.split(/\r?\n/).filter((line) => line.trim() !== "");
    return (
      <div className="space-y-4">
        {lines.map((line, index) => {
          // Build an array of details for any characters in this line that are found in the data
          const details = Array.from(line).reduce<string[]>((acc, char) => {
            if (kanjiData[char]) {
              const { meaning, on, kun, level} = kanjiData[char];
              // Format each kanji with its readings/meanings; adjust as desired.
              acc.push(
                `${char} | Level ${level} | ${meaning.join(", ")}${
                  on.length ? ` | On: ${on.join(", ")}` : ""
                }${kun.length ? ` | Kun: ${kun.join(", ")}` : ""}`
              );
            }
            return acc;
          }, []);

          return (
            <div
              key={index}
              className="flex justify-between items-start border-b border-gray-500 pb-2"
            >
              {/* Left column: the original text line */}
              <div className="whitespace-pre-wrap text-white font-bold">{line}</div>
              {/* Right column: details (if any) for this line */}
              <div className="text-sm text-white ml-4">
              {details.map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Kanji Identifier</title>
        <meta name="description" content="Identify Kanji and get readings instantly!" />
      </Head>
    <main className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-[#2c93e8] to-[#000000]">

      <h1 className="text-7xl text-white font-extrabold mb-8">TakoKani</h1>
      {showReader ? (
        // Reader Mode: shows the split lines on the left and kanji details on the right.
        <div className="w-full md:w-3/5 lg:w-2/5 bg-black bg-opacity-50 p-6 rounded-md items-center">
          <h2 className="text-2xl text-center font-bold text-white mb-4">
            Kanji Reader
          </h2>
          {kanjiOutput && renderFormattedOutput(text, kanjiOutput)}
          <div className="flex items-center"> </div>
            <button
              onClick={handleNewSearch}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md font-bold "
            >
            Find New
          </button>
        </div>
      ) : (
        // Search Mode: shows only the text input in the middle of the screen.
        <div className="w-full md:w-3/5 lg:w-2/5 bg-black bg-opacity-50 p-6 rounded-md flex flex-col items-center">
          <textarea
            className="w-full font-sans p-2 border border-gray-300 rounded-md text-white bg-transparent font-bold"
            placeholder="Enter Japanese text"
            rows={6}
            style={{ resize: "none", overflowWrap: "break-word" }}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md font-bold"
          >
            Search
          </button>
          {error && <div className="mt-4 text-red-500">{error}</div>}
        </div>
      )}
    </main>
    </>
  );
}