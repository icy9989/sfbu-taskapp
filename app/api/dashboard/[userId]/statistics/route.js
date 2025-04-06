import { NextRequest, NextResponse } from "next/server";
import prismadb from '@/lib/prismadb';

/**
 * @swagger
 * /api/dashboard/{userId}/statistics:
 *   get:
 *     tags: [Dashboard]
 *     description: Retrieves the dashboard statistics for a specific user.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The unique identifier of the user whose dashboard stats are to be fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's dashboard statistics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: The unique identifier of the user.
 *                   example: "user123"
 *                 tasksCompleted:
 *                   type: integer
 *                   description: The number of tasks the user has completed.
 *                   example: 15
 *                 projectsInvolved:
 *                   type: integer
 *                   description: The number of projects the user is involved in.
 *                   example: 5
 *                 activeTasks:
 *                   type: integer
 *                   description: The number of tasks the user is currently working on.
 *                   example: 3
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
 *       404:
 *         description: No stats found for the provided user ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User stats not found"
 *       500:
 *         description: Failed to fetch the user stats.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch stats"
 */

// Get user dashboard statistics based on userId
export async function GET(req, { params }) {
    try {
        // Validate userId from params
        if (!params.userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        // Fetch the user's dashboard stats
        const stats = await prismadb.dashboardStats.findUnique({
            where: {
                userId: params.userId, // Use the userId from route params
            },
        });

        // Check if stats exist for the user
        if (!stats) {
            return new NextResponse("User stats not found", { status: 404 });
        }

        // Return stats as JSON response
        return NextResponse.json(stats);
    } catch (error) {
        console.error("[FETCH_DASHBOARD_STATS]", error);
        return new NextResponse("Failed to fetch stats", { status: 500 });
    }
}
