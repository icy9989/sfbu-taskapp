import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     description: Retrieves a specific task by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the task to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the task details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the task.
 *                   example: "task123"
 *                 title:
 *                   type: string
 *                   description: The title of the task.
 *                   example: "Task Title"
 *                 description:
 *                   type: string
 *                   description: The description of the task.
 *                   example: "Task description here"
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                   description: The start date of the task.
 *                   example: "2025-04-05T09:00:00Z"
 *                 dueDate:
 *                   type: string
 *                   format: date-time
 *                   description: The due date of the task.
 *                   example: "2025-04-10T09:00:00Z"
 *                 priority:
 *                   type: string
 *                   description: The priority level of the task.
 *                   example: "High"
 *                 category:
 *                   type: string
 *                   description: The category of the task.
 *                   example: "Development"
 *                 status:
 *                   type: string
 *                   description: The current status of the task.
 *                   example: "In Progress"
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Internal server error.
 * 
 *   put:
 *     tags: [Tasks]
 *     description: Updates the details of a specific task by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the task to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The updated title of the task.
 *                 example: "Updated Task Title"
 *               description:
 *                 type: string
 *                 description: The updated description of the task.
 *                 example: "Updated task description"
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: The updated start date of the task.
 *                 example: "2025-04-06T09:00:00Z"
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: The updated due date of the task.
 *                 example: "2025-04-11T09:00:00Z"
 *               priority:
 *                 type: string
 *                 description: The updated priority level of the task.
 *                 example: "Medium"
 *               category:
 *                 type: string
 *                 description: The updated category of the task.
 *                 example: "Testing"
 *               status:
 *                 type: string
 *                 description: The updated status of the task.
 *                 example: "Completed"
 *     responses:
 *       200:
 *         description: Successfully updated the task.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the task.
 *                   example: "task123"
 *                 title:
 *                   type: string
 *                   description: The updated title of the task.
 *                   example: "Updated Task Title"
 *                 description:
 *                   type: string
 *                   description: The updated description of the task.
 *                   example: "Updated task description"
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                   description: The updated start date of the task.
 *                   example: "2025-04-06T09:00:00Z"
 *                 dueDate:
 *                   type: string
 *                   format: date-time
 *                   description: The updated due date of the task.
 *                   example: "2025-04-11T09:00:00Z"
 *                 priority:
 *                   type: string
 *                   description: The updated priority level of the task.
 *                   example: "Medium"
 *                 category:
 *                   type: string
 *                   description: The updated category of the task.
 *                   example: "Testing"
 *                 status:
 *                   type: string
 *                   description: The updated status of the task.
 *                   example: "Completed"
 *       400:
 *         description: Task ID is required.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error.
 * 
 *   delete:
 *     tags: [Tasks]
 *     description: Deletes a specific task by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the task to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the task.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task deleted successfully"
 *       400:
 *         description: Task ID is required.
 *       401:
 *         description: Unauthorized. User must be authenticated.
 *       500:
 *         description: Internal server error.
 */

// Get a specific task by ID
export async function GET(req, { params }) {
    try {
        const { currentUser } = await serverAuth();
        if (!currentUser) return new NextResponse("Unauthenticated", { status: 401 });

        if (!params.id) return new NextResponse("Task ID is required", { status: 400 });

        const task = await prismadb.task.findUnique({
            where: { id: params.id }
        });

        if (!task) return new NextResponse("Task not found", { status: 404 });

        return NextResponse.json(task);
    } catch (error) {
        console.log("[TASK_RETRIEVE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// Update Task
export async function PUT(req, { params }) {
    try {
        const { title, description, startDate, dueDate, priority, category, status } = await req.json();

        if (!params.id) return new NextResponse("Task ID is required", { status: 400 });

        const { currentUser } = await serverAuth();
        if (!currentUser) return new NextResponse("Unauthenticated", { status: 401 });

        const task = await prismadb.task.update({
            where: { id: params.id },
            data: { title, description, startDate: new Date(startDate), dueDate: new Date(dueDate), priority, category, status }
        });

        return NextResponse.json(task);
    } catch (error) {
        console.log("[TASK_UPDATE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// Delete Task
export async function DELETE(req, { params }) {
    try {
        if (!params.id) return new NextResponse("Task ID is required", { status: 400 });

        const { currentUser } = await serverAuth();
        if (!currentUser) return new NextResponse("Unauthenticated", { status: 401 });

        await prismadb.task.delete({ where: { id: params.id } });

        return new NextResponse("Task deleted successfully", { status: 200 });
    } catch (error) {
        console.log("[TASK_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}


// Get a specific task by ID
export async function GET(req, { params }) {
    try {
        const { currentUser } = await serverAuth();
        if (!currentUser) return new NextResponse("Unauthenticated", { status: 401 });

        if (!params.id) return new NextResponse("Task ID is required", { status: 400 });

        const task = await prismadb.task.findUnique({
            where: { id: params.id }
        });

        if (!task) return new NextResponse("Task not found", { status: 404 });

        return NextResponse.json(task);
    } catch (error) {
        console.log("[TASK_RETRIEVE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// Update Task
export async function PUT(req, { params }) {
    try {
        const { title, description, startDate, dueDate, priority, category, status } = await req.json();

        if (!params.id) return new NextResponse("Task ID is required", { status: 400 });

        const { currentUser } = await serverAuth();
        if (!currentUser) return new NextResponse("Unauthenticated", { status: 401 });

        const task = await prismadb.task.update({
            where: { id: params.id },
            data: { title, description, startDate: new Date(startDate), dueDate: new Date(dueDate), priority, category, status }
        });

        return NextResponse.json(task);
    } catch (error) {
        console.log("[TASK_UPDATE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

// Delete Task
export async function DELETE(req, { params }) {
    try {
        if (!params.id) return new NextResponse("Task ID is required", { status: 400 });

        const { currentUser } = await serverAuth();
        if (!currentUser) return new NextResponse("Unauthenticated", { status: 401 });

        await prismadb.task.delete({ where: { id: params.id } });

        return new NextResponse("Task deleted successfully", { status: 200 });
    } catch (error) {
        console.log("[TASK_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
