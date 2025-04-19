import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/dashboard/task-completion:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get overall task completion rate for the authenticated user
 *     description: |
 *       Retrieves the overall task completion rate for the **authenticated user**, including:
 *         - Tasks created by the user (personal tasks)
 *         - Tasks assigned to the user
 *         - Tasks from projects where the user is a team member
 *     responses:
 *       200:
 *         description: Successfully retrieved user task completion stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTasks:
 *                   type: integer
 *                   description: Total number of tasks relevant to the user
 *                   example: 25
 *                 completedTasks:
 *                   type: integer
 *                   description: Number of tasks marked as completed
 *                   example: 17
 *                 completionRate:
 *                   type: number
 *                   format: float
 *                   description: Percentage of tasks completed (0-100)
 *                   example: 68.0
 *       401:
 *         description: Unauthorized — user is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Server error while fetching task data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch task data"
 */

export async function GET() {
  try {
    const { currentUser } = await serverAuth();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch personal tasks (created by user)
    const createdTasks = await prismadb.task.findMany({
      where: { creatorId: currentUser.id },
    });

    // Fetch assigned tasks (assigned to user)
    const assignedTasksRelations = await prismadb.assignmentTasks.findMany({
      where: { assignedTo: currentUser.id },
      include: { task: true },
    });
    const assignedTasks = assignedTasksRelations.map((rel) => rel.task);

    // Fetch team project tasks where user is a team member
    const teamMemberships = await prismadb.teamMembers.findMany({
      where: { userId: currentUser.id },
      select: { teamId: true },
    });

    const teamIds = teamMemberships.map((tm) => tm.teamId);

    const teamTasks = await prismadb.task.findMany({
      where: { teamId: { in: teamIds } },
    });

    // Combine all tasks uniquely by task ID
    const allTasksMap = new Map();
    [...createdTasks, ...assignedTasks, ...teamTasks].forEach((task) => {
      allTasksMap.set(task.id, task);
    });

    const allTasks = Array.from(allTasksMap.values());
    const completedTasks = allTasks.filter((task) => task.status === "Completed");

    const completionRate = allTasks.length
      ? (completedTasks.length / allTasks.length) * 100
      : 0;

    const response = [
        { title: "Total Tasks", value: allTasks.length },
        { title: "Completed Tasks", value: completedTasks.length },
        { title: "Completion Rate", value: parseFloat(completionRate.toFixed(2)) }
      ];

      return NextResponse.json(response);
  } catch (error) {
    console.error("[FETCH_TASK_COMPLETION]", error);
    return NextResponse.json(
      { error: "Failed to fetch task data" },
      { status: 500 }
    );
  }
}
