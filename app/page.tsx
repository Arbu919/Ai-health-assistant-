import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-6">
          ZARO AI Health Assistant
        </h1>

        <p className="text-lg text-gray-600 mb-4">
          Describe your symptoms and receive educational guidance
          about what steps you may consider next.
        </p>

        <div className="mb-8 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ This assistant provides educational information only.
            It is not a substitute for professional medical advice,
            diagnosis, or treatment.
          </p>
        </div>

        <Link
          href="/chat"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
        >
          Start Symptom Check
        </Link>
      </div>
    </main>
  );
}