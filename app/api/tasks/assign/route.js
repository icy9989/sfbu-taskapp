import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/tasks/assign:
 *   post:
 *     tags: [Tasks]
 *     summary: Assign a task to a user
 *     description: Assigns a specific task to another user. The authenticated user is considered the assigner.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskId
 *               - assignedToId
 *             properties:
 *               taskId:
 *                 type: string
 *                 description: ID of the task to assign
 *                 example: "6615abc123ef45678901a234"
 *               assignedToId:
 *                 type: string
 *                 description: ID of the user to whom the task is being assigned
 *                 example: "6609def456bc78901234b567"
 *     responses:
 *       200:
 *         description: Task assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID of the assignment
 *                 assignedBy:
 *                   type: string
 *                   description: ID of the assigner (current user)
 *                 assignedToUser:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Jane Doe"
 *                 task:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Update website layout"
 *       400:
 *         description: Missing task ID or assigned user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Task ID and Assigned User ID are required"
 *       401:
 *         description: User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthenticated"
 *       500:
 *         description: Internal server error occurred
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *

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
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       401:
 *         description: Unauthenticated
 *       500:
 *         description: Internal server error
 */

// Create an assignment for a task
export async function POST(req) {
  try {
    const { taskId, assignedToId } = await req.json(); // Assuming you send taskId and assignedToId in the request body

    // Validate input
    if (!taskId || !assignedToId) {
      return new NextResponse("Task ID and Assigned User ID are required", { status: 400 });
    }

    // Get the current user (the one assigning the task)
    const { currentUser } = await serverAuth();
    if (!currentUser) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Create the assignment
    const assignment = await prismadb.assignmentTasks.create({
      data: {
        task: {
          connect: {
            id: taskId, // Connecting the task by ID
          },
        },
        assignedBy: currentUser.id, // The user assigning the task (current authenticated user)
        assignedToUser: {
          connect: {
            id: assignedToId, // The user being assigned the task
          },
        },
      },

      include: {
        assignedToUser: {
          select: {
            name: true, // Fetching the name of the assigned user
          },
        },
        task: {
          select: {
            title: true, // Optionally including the task title in the response
          },
        },
      },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.log("[TASK_ASSIGN]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}



