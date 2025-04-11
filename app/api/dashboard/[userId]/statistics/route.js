import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { isBefore } from "date-fns";

/**
 * @swagger
 * /api/dashboard/{userId}/statistics:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get dashboard statistics for a user
 *     description: |
 *       Returns high-level dashboard metrics for a user including:
 *         - Total tasks (created or assigned)
 *         - Completed tasks
 *         - Overdue tasks
 *         - Task completion rate
 *         - Active projects (based on team membership)
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The unique identifier of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 totalTasks:
 *                   type: integer
 *                   example: 30
 *                 completedTasks:
 *                   type: integer
 *                   example: 20
 *                 overdueTasks:
 *                   type: integer
 *                   example: 3
 *                 completionRate:
 *                   type: number
 *                   format: float
 *                   example: 66.67
 *                 activeProjects:
 *                   type: integer
 *                   example: 4
 *       400:
 *         description: User ID is required
 *       500:
 *         description: Server error while fetching dashboard stats
 */


export async function GET(req, { params }) {
    const { userId } = params;

    if (!userId) {
        return new NextResponse("User ID is required", { status: 400 });
    }

    try {
        // 1. Personal tasks
        const createdTasks = await prismadb.task.findMany({
            where: { creatorId: userId },
        });

        // 2. Assigned tasks
        const assignedRelations = await prismadb.assignmentTasks.findMany({
            where: { assignedTo: userId },
            include: { task: true },
        });

        const assignedTasks = assignedRelations.map(rel => rel.task);

        // Combine and deduplicate tasks by ID
        const allTasksMap = new Map();
        [...createdTasks, ...assignedTasks].forEach(task => {
            allTasksMap.set(task.id, task);
        });

        const allTasks = Array.from(allTasksMap.values());

        // Compute task stats
        const now = new Date();
        const completedTasks = allTasks.filter(t => t.status === "Completed");
        const overdueTasks = allTasks.filter(
            t => isBefore(new Date(t.dueDate), now) && t.status !== "Completed"
        );

        const totalTasks = allTasks.length;
        const completionRate = totalTasks
            ? (completedTasks.length / totalTasks) * 100
            : 0;

        // Get active projects from team membership
        const teams = await prismadb.teamMembers.findMany({
            where: { userId },
            select: { teamId: true },
        });

        const teamIds = teams.map(t => t.teamId);

        const activeProjects = await prismadb.project.count({
            where: {
                teamId: { in: teamIds },
            },
        });

        return NextResponse.json({
            userId,
            totalTasks,
            completedTasks: completedTasks.length,
            overdueTasks: overdueTasks.length,
            completionRate: parseFloat(completionRate.toFixed(2)),
            activeProjects,
        });
    } catch (error) {
        console.error("[DASHBOARD_STATS_ERROR]", error);
        return new NextResponse("Failed to fetch dashboard stats", { status: 500 });
    }
}
