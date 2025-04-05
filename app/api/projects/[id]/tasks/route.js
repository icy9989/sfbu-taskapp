import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

/**
 * @swagger
 * /api/projects/{id}/tasks:
 *   get:
 *     tags: [Projects]
 *     description: Retrieves all tasks associated with a specific project, ordered by creation date in descending order.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the project for which tasks are to be fetched.
 *         schema:
 *           type: string
 *           example: "project123"
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of tasks for the specified project.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the task.
 *                     example: "task456"
 *                   name:
 *                     type: string
 *                     description: The name of the task.
 *                     example: "Design Database Schema"
 *                   description:
 *                     type: string
 *                     description: A detailed description of the task.
 *                     example: "Create the initial database schema for the project."
 *                   status:
 *                     type: string
 *                     description: The current status of the task.
 *                     example: "In Progress"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the task was created.
 *                     example: "2025-04-05T14:00:00Z"
 *       500:
 *         description: Internal server error if there is an issue retrieving the tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */


// Get all tasks for a specific project
export async function GET(req, { params }) {
  try {
    const tasks = await prismadb.task.findMany({
      where: { projectId: params.id }, // Use projectId from the URL parameter
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.log("[PROJECT_TASKS_RETRIEVE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
