import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/dashboard/weekly-report:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get weekly task report for the authenticated user
 *     description: |
 *       Returns all tasks created by the **authenticated user** within the current week.
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's weekly task report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: string
 *                   example: "user123"
 *                 week:
 *                   type: string
 *                   example: "2024-W12"
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Complete report"
 *                       status:
 *                         type: string
 *                         example: "In Progress"
 *                       completionDate:
 *                         type: string
 *                         example: "2024-03-16T14:00:00Z"
 *                       progress:
 *                         type: integer
 *                         example: 80
 *       401:
 *         description: Unauthorized — user is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

export async function GET() {
  try {
    const { currentUser } = await serverAuth();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current week's start and end dates
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Sunday
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Fetch tasks created by the user this week
    const tasks = await prismadb.task.findMany({
      where: {
        creatorId: currentUser.id,
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    // Generate ISO week label (e.g., "2024-W12")
    const getISOWeek = (date) => {
      const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const dayNum = tmp.getUTCDay() || 7;
      tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
      const weekNum = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
      return `${tmp.getUTCFullYear()}-W${String(weekNum).padStart(2, "0")}`;
    };

    const week = getISOWeek(now);

    return NextResponse.json({
      user: currentUser.id,
      week,
      tasks: tasks.map((task) => ({
        title: task.title,
        status: task.status,
        completionDate: task.status === "Completed" ? task.updatedAt : null,
        progress: task.status === "Completed" ? 100 : task.progress,
      })),
    });
  } catch (error) {
    console.error("[TASK_WEEKLY_REPORT]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
