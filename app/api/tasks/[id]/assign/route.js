import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/tasks/{taskId}/assign:
 *   get:
 *     tags: [Tasks]
 *     summary: Get all assigned members of a task
 *     description: Returns a list of users assigned to a specific task.
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task
 *     responses:
 *       200:
 *         description: A list of assigned members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID of the user
 *                   name:
 *                     type: string
 *                   username:
 *                     type: string
 *       401:
 *         description: Unauthenticated
 *       400:
 *         description: Invalid or missing task ID
 *       500:
 *         description: Internal server error
 */

export async function GET(req, { params }) {
  try {
    const { currentUser } = await serverAuth();
    if (!currentUser) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const { id: taskId } = params;
    if (!taskId) {
      return new NextResponse("Task ID is required", { status: 400 });
    }

    const assignments = await prismadb.assignmentTasks.findMany({
      where: { taskId },
      select: {
        assignedToUser: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    const assignedMembers = assignments.map(a => ({
      id: a.assignedToUser.id,
      name: a.assignedToUser.name,
      username: a.assignedToUser.username,
    }));

    return NextResponse.json(assignedMembers);
  } catch (error) {
    console.error("[GET_TASK_ASSIGNMENTS]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
