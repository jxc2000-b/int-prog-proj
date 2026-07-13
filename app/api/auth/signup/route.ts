import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const MINIMUM_PASSWORD_LENGTH = 12;

const signupSchema = z.object({
  email: z
    .string()
    .trim()
    .email("A valid email address is required.")
    .transform((email) => email.toLowerCase()),
  password: z.string().min(MINIMUM_PASSWORD_LENGTH, {
    message: `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters.`,
  }),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const result = signupSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0]?.message ?? "Invalid signup data." },
      { status: 400 },
    );
  }

  const { email, password } = result.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });
  }

  const passwordHash = await hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ user }, { status: 201 });
}
