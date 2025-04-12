import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb';

// /**
//  * @swagger
//  * /api/dashboard/{userId}/team-productivity:
//  *   get:
//  *     tags: [Dashboard]
//  *     description: Retrieves team productivity insights for a specific user.
//  *     parameters:
//  *       - name: userId
//  *         in: path
//  *         required: true
//  *         description: The unique identifier of the user to get team insights for.
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved team productivity insights.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   teamName:
//  *                     type: string
//  *                     description: The name of the team.
//  *                     example: "Team A"
//  *                   totalTasks:
//  *                     type: integer
//  *                     description: The total number of tasks in the team.
//  *                     example: 50
//  *                   completedTasks:
//  *                     type: integer
//  *                     description: The number of tasks marked as completed in the team.
//  *                     example: 30
//  *                   completionRate:
//  *                     type: number
//  *                     format: float
//  *                     description: The completion rate percentage for the team.
//  *                     example: 60.0
//  *       400:
//  *         description: User ID is required in the path.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   example: "User ID is required"
//  *       500:
//  *         description: Failed to fetch team productivity insights.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   example: "Failed to fetch team insights"
//  */

// Get team productivity insights based on userId
export async function GET({ params }) {
    try {
        // Validate userId
        if (!params.userId) {

            return new NextResponse("User ID is required", { status: 400 });
        }

        // Fetch teams where the user is a member
        const teams = await prismadb.team.findMany({
            where: {
                members: {
                    some: {
                        userId: params.userId, // The user must be a member of the team
                    },
                },
            },
            include: {
                tasks: true,  // Include tasks related to the team
            },
        });

        // Process team insights
        const teamInsights = teams.map(team => {
            const totalTasks = team.tasks.length;
            const completedTasks = team.tasks.filter(t => t.status === "Completed").length;
            const completionRate = totalTasks
                ? (completedTasks / totalTasks) * 100
                : 0;

            return {
                teamName: team.name,
                totalTasks,
                completedTasks,
                completionRate,
            };
        });

        // Return the insights as JSON
        return NextResponse.json(teamInsights);
    } catch (error) {
        console.error("[FETCH_TEAM_INSIGHTS]", error);
        return new NextResponse("Failed to fetch team insights", { status: 500 });
    }
}
