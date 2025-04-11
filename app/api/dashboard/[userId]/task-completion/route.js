import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

/**
 * @swagger
 * /api/dashboard/{userId}/task-completion:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get overall task completion rate for a user
 *     description: |
 *       Retrieves the overall task completion rate for a user, including:
 *         - Tasks created by the user (personal tasks)
 *         - Tasks assigned to the user
 *         - Tasks from projects where the user is a team member
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The unique identifier of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved user task completion stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "6429dfc1e71a..."
 *                 totalTasks:
 *                   type: integer
 *                   description: Total number of tasks relevant to the user
 *                   example: 25
 *                 completedTasks:
 *                   type: integer
 *                   description: Number of tasks marked as completed
 *                   example: 17
 *                 completionRate:
 *                   type: number
 *                   format: float
 *                   description: Percentage of tasks completed (0-100)
 *                   example: 68.0
 *       400:
 *         description: User ID is required in the path
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User ID is required"
 *       500:
 *         description: Server error while fetching task data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch task data"
 */


export async function GET(req, { params }) {
    const { userId } = params;

    if (!userId) {
        return new NextResponse("User ID is required", { status: 400 });
    }

    try {
        // Fetch personal tasks (created by user)
        const createdTasks = await prismadb.task.findMany({
            where: { creatorId: userId },
        });

        // Fetch assigned tasks (assigned to user)
        const assignedTasksRelations = await prismadb.assignmentTasks.findMany({
            where: { assignedTo: userId },
            include: { task: true },
        });
        const assignedTasks = assignedTasksRelations.map(rel => rel.task);

        // Fetch team project tasks where user is a team member
        const teamMemberTeams = await prismadb.teamMembers.findMany({
            where: { userId },
            select: { teamId: true },
        });

        const teamIds = teamMemberTeams.map(tm => tm.teamId);

        const teamTasks = await prismadb.task.findMany({
            where: {
                teamId: { in: teamIds },
            },
        });

        // Combine all tasks without duplication (by task ID)
        const allTasksMap = new Map();

        [...createdTasks, ...assignedTasks, ...teamTasks].forEach(task => {
            allTasksMap.set(task.id, task);
        });

        const allTasks = Array.from(allTasksMap.values());
        const completedTasks = allTasks.filter(task => task.status === "Completed");

        const completionRate = allTasks.length
            ? (completedTasks.length / allTasks.length) * 100
            : 0;

        return NextResponse.json({
            userId,
            totalTasks: allTasks.length,
            completedTasks: completedTasks.length,
            completionRate: parseFloat(completionRate.toFixed(2)),
        });

    } catch (error) {
        console.error("[FETCH_TASK_COMPLETION]", error);
        return new NextResponse("Failed to fetch task data", { status: 500 });
    }
}
