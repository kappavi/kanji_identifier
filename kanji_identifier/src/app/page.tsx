import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#ffffff] to-[#000000] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Identify <span className="text-[hsl(207,80.30%,54.30%)]">Kanji</span> Now
        </h1>
        <div className="w-full md:w-3/5 lg:w-2/5 mt-8 flex flex-col items-center">
          <textarea
            className="w-full p-2 border border-black-200 rounded-md text-black"
            placeholder="Enter a Kanji"
            rows={4}
            style={{ resize: "none", overflowWrap: "break-word" }}
          />
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
            Search
          </button>
        </div>
      </div>
    </main>
  );
}
