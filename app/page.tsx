"use client";

import Link from "next/link";
import Statement from "./components/Statement";


export default function Home() {

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-neutral-100 text-center">
        <div className="mb-8">
          <Statement>Welcome to The Online Terms of Service Index</Statement>
        </div>
        <div className="flex justify-center gap-4">
          <Link
            className="rounded-lg bg-white px-4 py-2 font-semibold text-neutral-950 transition hover:bg-neutral-200"
            href="/signup"
          >
            Sign up
          </Link>
          <Link
            className="rounded-lg border border-neutral-700 px-4 py-2 font-semibold text-white transition hover:border-neutral-400"
            href="/login"
          >
            Log in
          </Link>
        </div>
    </main>
  );
}
