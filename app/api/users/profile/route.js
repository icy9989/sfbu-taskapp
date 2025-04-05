import { NextResponse } from "next/server";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags: [User API]
 *     description: Fetches the profile of the currently authenticated user. Automatically handles authentication through session cookies.
 *     responses:
 *       200:
 *         description: Successfully fetched the user's profile data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier for the user.
 *                   example: "67e797df47c9baab43d94182"
 *                 name:
 *                   type: string
 *                   description: The full name of the user.
 *                   example: "Vicky"
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *                   example: "kmhtwe1999@gmail.com"
 *                 notifications:
 *                   type: array
 *                   description: List of notifications related to the user.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "bcbcdc6d-798d-4f9d-bb5c-2f5cd687028d"
 *                       content:
 *                         type: string
 *                         example: "You have a new message."
 *                 dashboardStats:
 *                   type: object
 *                   properties:
 *                     totalTasks:
 *                       type: integer
 *                       example: 10
 *                     completedTasks:
 *                       type: integer
 *                       example: 5
 *                     overdueTasks:
 *                       type: integer
 *                       example: 2
 *                     completionRate:
 *                       type: number
 *                       format: float
 *                       example: 0.5
 *                     activeProjects:
 *                       type: integer
 *                       example: 3
 *       401:
 *         description: Unauthorized - The user is not authenticated or the session is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */


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
          // teams: {
          //   include: {
          //     team: true,  // Include team details, if any
          //   },
          // },
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
