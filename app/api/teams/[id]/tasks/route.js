import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/server-auth";


/**
 * @swagger
 * /api/teams/{teamId}/tasks:
 *   get:
 *     tags: [Teams]
 *     summary: Get tasks for a specific team
 *     description: Retrieves all tasks assigned to or created within the specified team.
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the team
 *         example: "team123"
 *     responses:
 *       200:
 *         description: List of tasks belonging to the team.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                   dueDate:
 *                     type: string
 *                     format: date-time
 *                   priority:
 *                     type: string
 *                   category:
 *                     type: string
 *                   status:
 *                     type: string
 *                   team:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   assignedTasks:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         assignedToUser:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *       401:
 *         description: Unauthenticated - user is not logged in
 *       403:
 *         description: Forbidden - user is not a member of the team
 *       500:
 *         description: Internal server error
 */
export async function GET(req, { params }) {
  try {
    const { teamId } = params;

    const { currentUser } = await serverAuth();
    if (!currentUser) return new NextResponse("Unauthenticated", { status: 401 });

    const isMember = await prismadb.teamMembers.findFirst({
      where: {
        teamId,
        userId: currentUser.id,
      },
    });

    if (!isMember) {
      return new NextResponse("You are not a member of this team", { status: 403 });
    }

    const tasks = await prismadb.task.findMany({
      where: {
        teamId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        assignedTasks: {
          include: {
            assignedToUser: true,
          },
        },
        team: true,
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("[TEAM_TASKS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
