import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/dashboard/{userId}/top-category:
 *   get:
 *     tags: [Dashboard]
 *     description: Retrieves the most frequent task categories for a specific user.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The unique identifier of the user whose task categories are to be fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the top task categories for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topCategories:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         description: The task category.
 *                         example: "Development"
 *                       taskCount:
 *                         type: integer
 *                         description: The number of tasks in the category.
 *                         example: 10
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
 *       401:
 *         description: The user is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthenticated"
 *       500:
 *         description: Failed to fetch task categories.
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

        if (!params.userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        // Ensure the user is authenticated
        const { currentUser } = await serverAuth();
        if (!currentUser) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Fetch tasks for the user and group by category to calculate frequencies
        const tasks = await prismadb.task.findMany({
            where: { creatorId: params.userId },
            select: { category: true },
        });

        // Count tasks per category
        const categoryCounts = tasks.reduce((acc, task) => {
            const category = task.category;
            acc[category] = acc[category] ? acc[category] + 1 : 1;
            return acc;
        }, {});

        // Convert the counts into an array of objects
        const topCategories = Object.entries(categoryCounts)
            .map(([category, taskCount]) => ({ category, taskCount }))
            .sort((a, b) => b.taskCount - a.taskCount); // Sort by task count in descending order

        return NextResponse.json({ topCategories });
    } catch (error) {
        console.log("[TASK_TOP_CATEGORIES]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
