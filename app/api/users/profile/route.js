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

    const user = await prismadb.user.findUnique({
        where: { id: currentUser.id },
        include: {
          teams: {
            include: {
              team: true,  // Include team details, if any
            },
          },
          notifications: true,
          dashboardStats: true,
        },
      });
      
      // Filter out any null team associations
      if (user.teams) {
        user.teams = user.teams.filter(teamMember => teamMember.team !== null);
      }
      
    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET_PROFILE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
