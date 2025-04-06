import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb';

/**
 * @swagger
 * /api/dashboard/{userId}/project-completion:
 *   get:
 *     tags: [Dashboard]
 *     description: Retrieves projects for a user along with their task completion rates. The user can be a creator or a member of the project team.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The unique identifier of the user for whom the projects are being fetched.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the project data with task completion rates.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   projectName:
 *                     type: string
 *                     description: The name of the project.
 *                     example: "Website Redesign"
 *                   totalTasks:
 *                     type: integer
 *                     description: The total number of tasks associated with the project.
 *                     example: 12
 *                   completedTasks:
 *                     type: integer
 *                     description: The number of tasks that have been completed.
 *                     example: 8
 *                   completionRate:
 *                     type: number
 *                     format: float
 *                     description: The percentage of tasks that have been completed in the project.
 *                     example: 66.67
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
 *         description: Failed to fetch project data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch project data"
 */


export async function GET(req, { params }) {
    try {
        // Validate the userId parameter
        if (!params.userId) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        // Fetch projects related to the user, either as a creator or a team member
        const projects = await prismadb.project.findMany({
            where: {
                // Find projects where the user is the creator or a member of the team
                team: {
                    members: {
                        some: {
                            userId: params.userId, // The user must be a member of the team
                        },
                    },
                },
            },
            include: {
                tasks: true, // Include tasks related to the project
                team: true,  // Include team information (optional)
            },
        });

        // Prepare project data with task completion info
        const projectData = projects.map(project => {
            // Get total and completed task counts
            const totalTasks = project.tasks.length;
            const completedTasks = project.tasks.filter(t => t.status === "Completed").length;
            const completionRate = totalTasks
                ? (completedTasks / totalTasks) * 100
                : 0;

            return {
                projectName: project.name,
                totalTasks,
                completedTasks,
                completionRate,
            };
        });

        return NextResponse.json(projectData);
    } catch (error) {
        console.error("[FETCH_PROJECT_COMPLETION]", error);
        return new NextResponse("Failed to fetch project data", { status: 500 });
    }
}
