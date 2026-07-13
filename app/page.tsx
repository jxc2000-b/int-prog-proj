"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import Statement from "./components/Statement";

export default function Home() {
  const { data: session, status } = useSession();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleCreatePost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, published: true }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Unable to create your post.");
        return;
      }

      setTitle("");
      setBody("");
      setMessage("Post created.");
    } catch {
      setError("Unable to create your post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-neutral-950 px-6 py-10 text-neutral-100 text-center">
      {status === "authenticated" ? (
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="absolute right-6 top-6 rounded-lg border border-neutral-700 px-4 py-2 text-sm font-semibold text-white transition hover:border-neutral-400"
        >
          Log out
        </button>
      ) : null}
      <div className="mx-auto grid max-w-xl gap-8">
        <div>
          <Statement>Welcome to The Online Terms of Service Index</Statement>
        </div>

        {status === "authenticated" && session.user ? (
          <form
            className="grid gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-left shadow-2xl"
            onSubmit={handleCreatePost}
          >
            <div>
              <h2 className="text-xl font-bold">Create a post</h2>
              <p className="mt-1 text-sm text-neutral-400">Signed in as {session.user.email}.</p>
            </div>

            <label className="grid gap-2 text-sm font-medium text-neutral-300">
              Title
              <input
                required
                maxLength={200}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-white outline-none focus:border-neutral-400"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-neutral-300">
              Post
              <textarea
                required
                maxLength={10_000}
                rows={7}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                className="resize-y rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-white outline-none focus:border-neutral-400"
              />
            </label>

            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            {message ? <p className="text-sm text-emerald-300">{message}</p> : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-white px-4 py-2 font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Publishing..." : "Publish post"}
            </button>
          </form>
        ) : status === "unauthenticated" ? (
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
        ) : (
          <p className="text-sm text-neutral-400">Loading account...</p>
        )}
      </div>
    </main>
  );
}
