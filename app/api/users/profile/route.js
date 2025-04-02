import { NextResponse } from "next/server";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/server-auth";

// GET /api/users/profile
export async function GET() {
  try {
    const { currentUser } = await serverAuth();  // Authentication middleware

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Fetch the current user's details from the database
    const user = await prismadb.user.findUnique({
      where: { id: currentUser.id },
      include: {
        teams: {
          include: {
            team: true,  // Include the team details, if any
          },
        },
        notifications: true,
        dashboardStats: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Handle the case where the user has no team or is not part of any team
    if (!user.teams || user.teams.length === 0) {
      user.teams = []; // No teams associated
    } else {
      // Ensure each team entry has valid team data (if it's null, it will be handled)
      user.teams = user.teams.filter(team => team.team !== null);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET_PROFILE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
