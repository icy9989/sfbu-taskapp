import { NextRequest, NextResponse } from "next/server";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     tags: [Tasks]
 *     description: Creates a new task and assigns it to a team or project, and optionally to users.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the task.
 *                 example: "Design the login page"
 *               description:
 *                 type: string
 *                 description: A detailed description of the task.
 *                 example: "Create the UI for the login page using Figma."
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: The date when the task starts.
 *                 example: "2025-04-01T09:00:00Z"
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: The deadline for the task.
 *                 example: "2025-04-05T17:00:00Z"
 *               priority:
 *                 type: string
 *                 description: The priority of the task.
 *                 example: "High"
 *               category:
 *                 type: string
 *                 description: The category of the task (e.g., "UI", "Backend").
 *                 example: "UI"
 *               status:
 *                 type: string
 *                 description: The current status of the task.
 *                 example: "In Progress"
 *               teamId:
 *                 type: string
 *                 description: The ID of the team the task belongs to.
 *                 example: "team123"
 *               projectId:
 *                 type: string
 *                 description: The ID of the project the task belongs to.
 *                 example: "project456"
 *               assignedTo:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: The user IDs to which the task is assigned.
 *                   example: ["user789", "user101"]
 *     responses:
 *       200:
 *         description: Task successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier for the task.
 *                   example: "task987"
 *                 title:
 *                   type: string
 *                   description: The title of the task.
 *                   example: "Design the login page"
 *                 description:
 *                   type: string
 *                   description: The description of the task.
 *                   example: "Create the UI for the login page using Figma."
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                   description: The start date of the task.
 *                   example: "2025-04-01T09:00:00Z"
 *                 dueDate:
 *                   type: string
 *                   format: date-time
 *                   description: The due date of the task.
 *                   example: "2025-04-05T17:00:00Z"
 *                 priority:
 *                   type: string
 *                   description: The priority level of the task.
 *                   example: "High"
 *                 category:
 *                   type: string
 *                   description: The category of the task.
 *                   example: "UI"
 *                 status:
 *                   type: string
 *                   description: The status of the task.
 *                   example: "In Progress"
 *                 teamId:
 *                   type: string
 *                   description: The team associated with the task.
 *                   example: "team123"
 *                 projectId:
 *                   type: string
 *                   description: The project associated with the task.
 *                   example: "project456"
 *       400:
 *         description: Bad request, missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Title is required"
 *       401:
 *         description: Unauthorized if the user is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthenticated"
 *       403:
 *         description: Forbidden if the user is not part of the team.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You are not a member of this team"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 * 
 *   get:
 *     tags: [Tasks]
 *     description: Retrieves all tasks for the current user, including those they created or are assigned to.
 *     responses:
 *       200:
 *         description: A list of tasks the user is involved in.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the task.
 *                     example: "task987"
 *                   title:
 *                     type: string
 *                     description: The title of the task.
 *                     example: "Design the login page"
 *                   description:
 *                     type: string
 *                     description: The task's description.
 *                     example: "Create the UI for the login page using Figma."
 *                   startDate:
 *                     type: string
 *                     format: date-time
 *                     description: The start date of the task.
 *                     example: "2025-04-01T09:00:00Z"
 *                   dueDate:
 *                     type: string
 *                     format: date-time
 *                     description: The due date of the task.
 *                     example: "2025-04-05T17:00:00Z"
 *                   priority:
 *                     type: string
 *                     description: The priority of the task.
 *                     example: "High"
 *                   category:
 *                     type: string
 *                     description: The category of the task.
 *                     example: "UI"
 *                   status:
 *                     type: string
 *                     description: The status of the task.
 *                     example: "In Progress"
 *                   assignedTasks:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         assignedTo:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               description: The user ID of the assigned user.
 *                               example: "user789"
 *                             name:
 *                               type: string
 *                               description: The name of the assigned user.
 *                               example: "John Doe"
 *                   team:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The team ID.
 *                         example: "team123"
 *                       name:
 *                         type: string
 *                         description: The name of the team.
 *                         example: "Design Team"
 *       401:
 *         description: Unauthorized if the user is not authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthenticated"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */


// Create Task
export async function POST(req) {
  try {
    const { title, description, startDate, dueDate, priority, category, status, teamId, projectId, assignedTo } = await req.json();

    // Validation checks
    if (!title) return new NextResponse("Title is required", { status: 400 });
    if (!startDate) return new NextResponse("Start Date is required", { status: 400 });
    if (!dueDate) return new NextResponse("Due Date is required", { status: 400 });
    if (!priority) return new NextResponse("Priority is required", { status: 400 });
    if (!category) return new NextResponse("Category is required", { status: 400 });
    if (!status) return new NextResponse("Status is required", { status: 400 });

    // Authenticate user
    const { currentUser } = await serverAuth();
    if (!currentUser) return new NextResponse("Unauthenticated", { status: 401 });

    // Ensure the user is part of the team (optional security measure)
    if (teamId) {
      const userTeamMember = await prismadb.teamMembers.findFirst({
        where: {
          userId: currentUser.id,
          teamId: teamId
        }
      });

      if (!userTeamMember) {
        return new NextResponse("You are not a member of this team", { status: 403 });
      }
    }

    // Create task
    const task = await prismadb.task.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        priority,
        category,
        status,
        creatorId: currentUser.id,
        // Optional: Team and Project assignments
        teamId: teamId || undefined,  // Use `undefined` if not part of a team
        projectId: projectId || undefined, // Use `undefined` if not part of a project
        // Handle assignment relations if there are any
        assignedTasks: assignedTo && assignedTo.length > 0 ? {
          create: assignedTo.map((userId) => ({
            assignedBy: currentUser.id,
            assignedTo: userId
          }))
        } : undefined
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    console.log("[TASK_CREATE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Get all tasks for the current user (either created or assigned)
export async function GET() {
    try {
        const { currentUser } = await serverAuth();
        if (!currentUser) return new NextResponse("Unauthenticated", { status: 401 });

        // Get tasks where the user is the creator or assigned to them
        const tasks = await prismadb.task.findMany({
            where: {
                OR: [
                    { creatorId: currentUser.id }, // Tasks created by the user
                    {
                        assignedTasks: {
                            some: {
                                assignedTo: currentUser.id // Tasks assigned to the user
                            }
                        }
                    }
                ]
            },
            orderBy: { createdAt: "desc" },
            include: {
                assignedTasks: {
                    include: {
                        assignedToUser: true // Include the assigned user information
                    }
                },
                team: true // Include team details
            }
        });

        return NextResponse.json(tasks);
    } catch (error) {
        console.log("[TASKS_RETRIEVE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
