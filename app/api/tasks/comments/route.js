import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

/**
 * @swagger
 * /api/tasks/comments:
 *   post:
 *     tags: [Tasks]
 *     description: Adds a comment to a specific task.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *                 description: The unique identifier of the task to which the comment is being added.
 *                 example: "task123"
 *               userId:
 *                 type: string
 *                 description: The unique identifier of the user adding the comment.
 *                 example: "user456"
 *               comment:
 *                 type: string
 *                 description: The comment content.
 *                 example: "This task needs more clarification."
 *     responses:
 *       200:
 *         description: Successfully added the comment to the task.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: "Comment added successfully"
 *                 comment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the comment.
 *                       example: "comment789"
 *                     taskId:
 *                       type: string
 *                       description: The ID of the task the comment was added to.
 *                       example: "task123"
 *                     userId:
 *                       type: string
 *                       description: The ID of the user who added the comment.
 *                       example: "user456"
 *                     comment:
 *                       type: string
 *                       description: The comment content.
 *                       example: "This task needs more clarification."
 *                     timestamp:
 *                       type: string
 *                       description: The time the comment was added.
 *                       example: "2024-04-05T08:30:00Z"
 *       400:
 *         description: Missing required fields in the request body (taskId, userId, comment).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Missing required fields"
 *       500:
 *         description: Internal server error while adding the comment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

// Add a comment to a task
export async function POST(req) {
    try {
        // Parse request body
        const { taskId, userId, comment } = await req.json();

        // Validate the request data
        if (!taskId || !userId || !comment) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Save the comment to the database
        const newComment = await prismadb.comment.create({
            data: {
                taskId,
                userId,
                comment, // Match with schema
                timestamp: new Date(),
            },
        });

        // Return success response
        return NextResponse.json({
            message: "Comment added successfully",
            comment: newComment,
        });
    } catch (error) {
        console.error("[COMMENT_ADD_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
