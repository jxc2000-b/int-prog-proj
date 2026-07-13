import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const MINIMUM_PASSWORD_LENGTH = 12;

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const email =
    typeof body === "object" && body !== null && "email" in body && typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";
  const password =
    typeof body === "object" && body !== null && "password" in body && typeof body.password === "string"
      ? body.password
      : "";

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  if (password.length < MINIMUM_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters.` },
      { status: 400 },
    );
  }

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
