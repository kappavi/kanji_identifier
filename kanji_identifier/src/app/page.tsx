"use client";
import Link from "next/link";
import { useState } from "react";
import { set } from "zod";

export default function HomePage() {
  const [text, setText] = useState<string>("");
  const [kanjiOutput, setKanjiOutput] = useState(null);
  const [error, setError] = useState<string>("");
  const handleSearch = async () => {
    if (text === "") {
      setError("Please enter some text");
      return;
    }
    try {
      setError("");
      console.log("Making the request http://127.0.0.1:8000/kanji-info?text=${text} with text", text);
      const response = await fetch(`http://127.0.0.1:8000/kanji-info?text=${text}`);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      setKanjiOutput(data);
      console.log("Data", data);
    } catch (error) {
      setError("Something went wrong");
      console.error(error);
  } };
  function formatOutput(output: Record<string, { level: number; meaning: string[], on: string[]; kun: string[] }>) {
    if (!output) {
      return "";
    }
    let returnString: string = "";
    for (const kanji in output) {
      const level = output[kanji]?.level;
      const meaning = output[kanji]?.meaning.join(", ");
      const on = output[kanji]?.on.join(", ");
      const kun = output[kanji]?.kun.join(", ");
      returnString += `${kanji} | Level: ${level} | Meanings: ${meaning} | On: ${on}, Kun: ${kun}\n`;
    }
    return returnString;
    // return JSON.stringify(output, null, 2);
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2c93e8] to-[#000000] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Identify <span className="text-[hsl(207,37.30%,67.50%)]">Kanji</span> Now
        </h1>
        <div className="w-full md:w-3/5 lg:w-2/5 mt-8 flex flex-col items-center">
          <textarea
            className="w-full font-sans p-2 border border-black-200 rounded-md text-black"
            placeholder="Enter a Kanji"
            rows={4}
            style={{ resize: "none", overflowWrap: "break-word" }}
            onChange = {(e) => setText(e.target.value)}
          />
          <button className="mt-4 font-sans bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handleSearch}>
            Search
          </button>
        </div>
      {kanjiOutput && formatOutput(kanjiOutput) && (
        <div className="mt-8 w-full md:w-3/5 lg:w-2/5 bg-white p-4 rounded-md text-black">
            <h2 className="text-2xl font-sans mb-4 text-center">Kanji Information</h2>
          <pre className="font-sans">{formatOutput(kanjiOutput)}</pre>
        </div>
      )}
      {error && (
        <div className="mt-4 text-red-500">
          {error}
        </div>
      )}
      </div>
    </main>
  );
}
