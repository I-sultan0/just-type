import Head from "next/head";
import TypingPractice from "../components/TypingPractice";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        <title>Just Type</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-indigo-600 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Typing Skills Improver</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <TypingPractice />
      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Typing Skills Improver. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
