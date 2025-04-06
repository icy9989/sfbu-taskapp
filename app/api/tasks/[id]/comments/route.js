import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

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


export async function GET(req, { params }) {
    try {
        const { taskId } = await params; //
        // Correct way to access params
        const comments = await prismadb.comment.findMany({    
            where: { taskId },       
            orderBy: { timestamp: "asc" }, // Order by timestamp to get comments in chronological order
            include: {
                user: {
                    select: { id: true, name: true }, // Select relevant user fields
                },
            },
        });

        return NextResponse.json(comments);
    } catch {
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}
