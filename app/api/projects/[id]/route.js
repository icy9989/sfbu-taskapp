import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     tags: [Projects]
 *     description: Retrieves the details of a specific project by its ID, including associated team and tasks.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the project to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the project details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the project.
 *                   example: "project456"
 *                 name:
 *                   type: string
 *                   description: The name of the project.
 *                   example: "Project X"
 *                 team:
 *                   type: object
 *                   description: Information about the team associated with the project.
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the team.
 *                       example: "team123"
 *                     name:
 *                       type: string
 *                       description: The name of the team.
 *                       example: "Team Alpha"
 *                 tasks:
 *                   type: array
 *                   description: List of tasks associated with the project.
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier of the task.
 *                         example: "task123"
 *                       name:
 *                         type: string
 *                         description: The name of the task.
 *                         example: "Task 1"
 *       404:
 *         description: Project not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Project not found"
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
 *   put:
 *     tags: [Projects]
 *     description: Updates the details of a specific project by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the project to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the project.
 *                 example: "Updated Project X"
 *     responses:
 *       200:
 *         description: Successfully updated the project.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the project.
 *                   example: "project456"
 *                 name:
 *                   type: string
 *                   description: The updated name of the project.
 *                   example: "Updated Project X"
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
 *   delete:
 *     tags: [Projects]
 *     description: Deletes a specific project by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the project to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the project.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Project deleted successfully"
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

// Get project details by ID
export async function GET(req, { params }) {
  try {
    const project = await prismadb.project.findUnique({
      where: { id: params.id },
      include: { team: true, tasks: true }, // Include team info and tasks
    });

    if (!project) return new NextResponse("Project not found", { status: 404 });

    return NextResponse.json(project);
  } catch (error) {
    console.log("[PROJECT_GET_BY_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Update project details
export async function PUT(req, { params }) {
    try {
      const { name } = await req.json();
  
      // Update project in the database
      const project = await prismadb.project.update({
        where: { id: params.id },
        data: { name },
      });
  
      return NextResponse.json(project);
    } catch (error) {
      console.log("[PROJECT_UPDATE]", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }

  // Delete a project by ID
export async function DELETE(req, { params }) {
    try {
      await prismadb.project.delete({
        where: { id: params.id },
      });
  
      return new NextResponse("Project deleted successfully", { status: 200 });
    } catch (error) {
      console.log("[PROJECT_DELETE]", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }