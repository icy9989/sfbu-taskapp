import { NextRequest, NextResponse } from "next/server";
import prismadb from '@/lib/prismadb';

/**
 * @swagger
 * /api/dashboard/{userId}/weekly-report:
 *   get:
 *     tags: [Dashboard]
 *     description: Retrieves the weekly task report for a specific user.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The unique identifier of the user whose weekly report is to be fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's weekly task report.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   description: The unique identifier of the user.
 *                   example: "user123"
 *                 week:
 *                   type: string
 *                   description: The week for which the report is generated.
 *                   example: "2024-W12"
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         description: The title of the task.
 *                         example: "Complete report"
 *                       status:
 *                         type: string
 *                         description: The current status of the task.
 *                         example: "In Progress"
 *                       completionDate:
 *                         type: string
 *                         description: The completion date of the task (if completed).
 *                         example: "2024-03-16T14:00:00Z"
 *                       progress:
 *                         type: integer
 *                         description: The progress percentage of the task.
 *                         example: 80
 *       400:
 *         description: User ID is required in the path.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User ID is required"
 *       500:
 *         description: Failed to fetch the weekly task report.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */


// Get weekly report for a user
export async function GET(req, { params }) {
    try {

        if (!params.userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        // Fetch tasks for the user in the current week
        const currentDate = new Date();
        const weekStart = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())); // Sunday of current week
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6); // Saturday of current week

        const tasks = await prismadb.task.findMany({
            where: {
                creatorId: params.userId,
                createdAt: {
                    gte: weekStart,
                    lte: weekEnd
                }
            }
        });

        return NextResponse.json({
            user: params.userId,
            week: `2024-W12`, // This could be dynamically calculated based on currentDate
            tasks: tasks.map(task => ({
                title: task.title,
                status: task.status,
                completionDate: task.status === 'Completed' ? task.updatedAt : null,
                progress: task.status === 'Completed' ? 100 : task.progress
            }))
        });
    } catch (error) {
        console.log("[TASK_WEEKLY_REPORT]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
