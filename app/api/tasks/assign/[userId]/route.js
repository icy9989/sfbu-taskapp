import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb';

/**
 * @swagger
 * /api/tasks/assign/{userId}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get all tasks assigned to a specific user
 *     description: Retrieves all tasks that have been assigned to a specific user, including information about the assignment and assigner.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The unique identifier of the user to whom tasks are assigned
 *         schema:
 *           type: string
 *           example: "6609def456bc78901234b567"
 *     responses:
 *       200:
 *         description: List of assigned tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Task ID
 *                     example: "6615abc123ef45678901a234"
 *                   title:
 *                     type: string
 *                     description: Task title
 *                     example: "Write documentation"
 *                   category:
 *                     type: string
 *                     description: Task category
 *                     example: "Documentation"
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-07T09:00:00.000Z"
 *                   dueDate:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-04-10T17:00:00.000Z"
 *                   assignedTasks:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         assignedBy:
 *                           type: string
 *                           description: User ID of the assigner
 *                         assignedTo:
 *                           type: string
 *                           description: User ID of the assignee
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           description: When the task was assigned
 *                         assignedToUser:
 *                           type: object
 *                           properties:
 *                             name:
 *                               type: string
 *                               description: Name of the assigned user
 *                               example: "Jane Doe"
 *       400:
 *         description: User ID is missing in the path
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User ID is required"
 *       500:
 *         description: Internal Server Error
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
