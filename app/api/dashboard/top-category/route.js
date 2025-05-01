import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/dashboard/top-category:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get top task categories for the authenticated user
 *     description: |
 *       Retrieves the most frequent task categories for the **authenticated user** based on their created tasks.
 *     responses:
 *       200:
 *         description: Successfully retrieved the top task categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category:
 *                     type: string
 *                     description: The task category name
 *                     example: "Development"
 *                   taskCount:
 *                     type: integer
 *                     description: The number of tasks in this category
 *                     example: 10
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
 *         description: Server error while fetching category data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch top categories"
 */

export async function GET() {
  try {
    const { currentUser } = await serverAuth();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await prismadb.task.findMany({
      where: { creatorId: currentUser.id },
      select: { category: true },
    });

    const categoryCounts = tasks.reduce((acc, task) => {
      const category = task.category || "Uncategorized";
      acc[category] = acc[category] ? acc[category] + 1 : 1;
      return acc;
    }, {});

    const topCategories = Object.entries(categoryCounts)
      .map(([category, taskCount]) => ({ category, taskCount }))
      .sort((a, b) => b.taskCount - a.taskCount);

    return NextResponse.json(topCategories);
  } catch (error) {
    console.error("[FETCH_TOP_CATEGORIES]", error);
    return NextResponse.json(
      { error: "Failed to fetch top categories" },
      { status: 500 }
    );
  }
}
