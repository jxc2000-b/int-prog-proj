import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

const createPostSchema = z.object({
  title: z.string().trim().min(1, "A title is required.").max(200),
  body: z.string().trim().min(1, "Post content is required.").max(10_000),
  published: z.boolean().default(true),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: "You must be signed in to create a post." }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const result = createPostSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Invalid post data." },
      { status: 400 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Signed-in user was not found." }, { status: 401 });
  }

  const post = await prisma.post.create({
    data: {
      ...result.data,
      authorId: user.id,
    },
    select: {
      id: true,
      title: true,
      body: true,
      published: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ post }, { status: 201 });
}
