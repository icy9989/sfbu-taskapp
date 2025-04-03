import { NextResponse } from "next/server";

import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/server-auth";


/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     description: Fetch the profile of the current authenticated user, including associated teams, notifications, and dashboard stats.
 *     responses:
 *       200:
 *         description: Successfully retrieved the user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique identifier of the user.
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Full name of the user.
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   description: The email address of the user.
 *                   example: john.doe@example.com
 *                 teams:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       team:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: The unique identifier of the team.
 *                             example: 101
 *                           name:
 *                             type: string
 *                             description: The name of the team.
 *                             example: Development Team
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The unique identifier of the notification.
 *                         example: 1
 *                       message:
 *                         type: string
 *                         description: The content of the notification.
 *                         example: "Your task is due in 2 hours."
 *                 dashboardStats:
 *                   type: object
 *                   properties:
 *                     totalTasks:
 *                       type: integer
 *                       description: The total number of tasks assigned to the user.
 *                       example: 10
 *                     completedTasks:
 *                       type: integer
 *                       description: The total number of tasks completed by the user.
 *                       example: 5
 *                     overdueTasks:
 *                       type: integer
 *                       description: The number of tasks that are overdue.
 *                       example: 2
 *                     completionRate:
 *                       type: number
 *                       format: float
 *                       description: The completion rate of the user.
 *                       example: 0.5
 *                     activeProjects:
 *                       type: integer
 *                       description: The number of active projects the user is involved in.
 *                       example: 3
 *       401:
 *         description: Unauthorized. The user is not authenticated.
 *       500:
 *         description: Internal Server Error. An error occurred while fetching the user profile.
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
