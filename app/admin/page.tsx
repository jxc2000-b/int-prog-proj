import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-neutral-100">
      <section className="mx-auto max-w-4xl rounded-xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        <p className="text-sm font-medium text-emerald-300">Administrator</p>
        <h1 className="mt-2 text-3xl font-bold">Admin page</h1>
        <p className="mt-3 text-neutral-400">Administrative tools will live here.</p>
      </section>
    </main>
  );
}
