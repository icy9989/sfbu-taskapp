import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb';

/**
 * @swagger
 * /api/tasks/{taskId}/comments:
 *   get:
 *     tags: [Tasks]
 *     description: Retrieves all comments for a specific task, ordered by timestamp.
 *     parameters:
 *       - name: taskId
 *         in: path
 *         required: true
 *         description: The unique identifier of the task whose comments are to be fetched.
 *         schema:
 *           type: string
 *           example: "task123"
 *     responses:
 *       200:
 *         description: Successfully retrieved comments for the task.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the comment.
 *                     example: "comment789"
 *                   userId:
 *                     type: string
 *                     description: The ID of the user who made the comment.
 *                     example: "user456"
 *                   comment:
 *                     type: string
 *                     description: The content of the comment.
 *                     example: "This task needs more clarification."
 *                   timestamp:
 *                     type: string
 *                     description: The time when the comment was made.
 *                     example: "2024-04-05T08:30:00Z"
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The ID of the user.
 *                         example: "user456"
 *                       name:
 *                         type: string
 *                         description: The name of the user.
 *                         example: "John Doe"
 *       400:
 *         description: Invalid task ID supplied.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid task ID"
 *       500:
 *         description: Failed to fetch comments for the task.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */


// Get all tasks assigned to a User
export async function GET(req, { params }) {
    try {
        // Validate that the userId parameter is provided
        if (!params.userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        // Fetch tasks assigned to the particular user through the AssignmentTasks model
        const tasks = await prismadb.task.findMany({
            where: {
                assignedTasks: {
                    some: { assignedTo: params.userId }, // Filter for tasks where the user is assigned
                },
            },
            select: {
                id: true, // Selecting task ID
                title: true, // Selecting task title
                category: true, // Selecting task category
                startDate: true, // Selecting task start date
                dueDate: true, // Selecting task due date
                assignedTasks: {
                    where: {
                        assignedTo: params.userId, // Ensuring we only fetch assignments for the specific user
                    },
                    select: {
                        assignedBy: true, // Who assigned the task
                        assignedTo: true, // Who the task is assigned to
                        createdAt: true, // When the assignment was created
                        assignedToUser: {
                            select: {
                                name: true, // Including the name of the user assigned to the task
                            },
                        },
                    },
                },
            },
        });

        // Return the fetched tasks as JSON response
        return NextResponse.json(tasks);
    } catch (error) {
        console.log("[TASKS_ASSIGNED_RETRIEVE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
