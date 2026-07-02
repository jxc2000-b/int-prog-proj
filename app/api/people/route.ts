import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) { 
    const { searchParams } = new URL(request.url);

    const name = searchParams.get("name")?.trim();
    const skill = searchParams.get("skill")?.trim();

    const people = await prisma.people.findMany({
        where: {
            AND: [
                name
                ? {
                    name: {
                        contains: name,
                        mode: "insensitive",
                    },
                }
            : {},
                skill
                ? {
                    skills : {
                        has: skill,
                    },
                }
            : {},
            ],
        },
        orderBy: {
            name: "asc",
        },     
    });

    const peopleSkillRows = await prisma.people.findMany({
        select: {
            skills: true,
        },
    });

    const skills = Array.from(
        new Set(peopleSkillRows.flatMap((person) => person.skills))
    ).sort();

    return NextResponse.json({
        people,
        filters: {
            skills,
        },
        count: people.length,
    });
}

// we get the following routes: 

// /api/people?name=Bryan 
// /api/people?skill=creativity
// /api/people?name=Bryan&skill=creativity