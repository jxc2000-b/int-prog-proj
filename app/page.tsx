"use client";

import { useEffect, useMemo, useState } from "react";
import avatar from "../public/avatar.jpg";
import { Person, PeopleResponse } from "./types"

export default function Home() {
  const [people, setPeople] = useState<Person[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPeople() {
      try {
        const response = await fetch("/api/people");

        if (!response.ok) {
          throw new Error("Unable to load people");
        }

        const data = (await response.json()) as PeopleResponse;

        if (isMounted) {
          setPeople(data.people);
          setActiveIndex(0);
          setError(null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error ? loadError.message : "Unable to load people",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPeople();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (people.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % people.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, [people.length]);

  const activePerson = people[activeIndex];
  const averageHeight = useMemo(() => {
    if (people.length === 0) {
      return 0;
    }

    return people.reduce((total, person) => total + person.height, 0) / people.length;
  }, [people]);

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-neutral-100">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center">
        <div className="mb-8">
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-white md:text-6xl">
            The people of all time
          </h1>
        </div>

        <div className="grid gap-6">
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            {isLoading ? (
              <p className="text-lg text-neutral-300">Loading people...</p>
            ) : error ? (
              <p className="text-lg text-red-300">{error}</p>
            ) : activePerson ? (
              <div className="grid gap-6 sm:grid-cols-[160px_1fr] sm:items-center">
                <img
                  src={avatar.src}
                  alt=""
                  className="aspect-square w-40 rounded-lg object-cover"
                />
                <div>
                  <h2 className="text-5xl font-bold tracking-normal text-white">
                    {activePerson.name}
                  </h2>
                  <dl className="mt-6 grid gap-4 sm:grid-rows-2">
                    <Metric label="Height" value={`${activePerson.height} inches`} />
                    <Metric label="Weight" value={`${activePerson.weight} lbs`} />
                    <Metric label="Skills" value={activePerson.skills.join(", ")} />
                  </dl>
                </div>
              </div>
            ) : (
              <p className="text-lg text-neutral-300">No people found.</p>
            )}
          </div>
        </div>
      </section>
      <footer className="mx-auto mt-8 max-w-5xl border-t border-neutral-800 pt-4 text-sm text-neutral-500">
        {people.length} {people.length === 1 ? "person" : "people"} fetched,
        refreshing every 2 seconds.
      </footer>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="shrink-0 text-sm text-neutral-400">{label}</dt>
      <dd className="min-w-0 text-2xl font-semibold text-white">{value}</dd>
    </div>
  );
}
