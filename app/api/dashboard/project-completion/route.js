import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/dashboard/project-completion:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get project task completion rates for the authenticated user
 *     description: |
 *       Retrieves all projects where the **authenticated user** is a member of the project team.
 *       Returns each project's total number of tasks, completed tasks, and overall completion rate.
 *     responses:
 *       200:
 *         description: Successfully retrieved the project data with task completion rates.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   projectName:
 *                     type: string
 *                     description: The name of the project.
 *                     example: "Website Redesign"
 *                   totalTasks:
 *                     type: integer
 *                     description: The total number of tasks associated with the project.
 *                     example: 12
 *                   completedTasks:
 *                     type: integer
 *                     description: The number of tasks that have been completed.
 *                     example: 8
 *                   completionRate:
 *                     type: number
 *                     format: float
 *                     description: The percentage of tasks that have been completed in the project.
 *                     example: 66.67
 *       401:
 *         description: Unauthorized — user is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Failed to fetch project data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch project data"
 */

export async function GET() {
  try {
    const { currentUser } = await serverAuth();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prismadb.project.findMany({
      where: {
        team: {
          members: {
            some: {
              userId: currentUser.id,
            },
          },
        },
      },
      include: {
        tasks: true,
      },
    });

    const projectData = projects.map((project) => {
      const totalTasks = project.tasks.length;
      const completedTasks = project.tasks.filter((t) => t.status === "Completed").length;
      const completionRate = totalTasks
        ? parseFloat(((completedTasks / totalTasks) * 100).toFixed(2))
        : 0;

      return {
        projectName: project.name,
        totalTasks,
        completedTasks,
        completionRate,
      };
    });

    return NextResponse.json(projectData);
  } catch (error) {
    console.error("[FETCH_PROJECT_COMPLETION]", error);
    return NextResponse.json({ error: "Failed to fetch project data" }, { status: 500 });
  }
}
