import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/projects:
 *   post:
 *     tags: [Projects]
 *     description: Creates a new project associated with a specific team. The user must be authenticated via NextAuth.js.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the project.
 *                 example: "Project X"
 *               teamId:
 *                 type: string
 *                 description: The unique identifier of the team the project belongs to.
 *                 example: "team123"
 *     responses:
 *       200:
 *         description: Successfully created the new project.
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
 *                 teamId:
 *                   type: string
 *                   description: The team that owns the project.
 *                   example: "team123"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The date and time when the project was created.
 *                   example: "2025-04-05T14:00:00Z"
 *       400:
 *         description: Bad Request if the name or teamId is missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Name is required"
 *       401:
 *         description: Unauthorized if the user is not authenticated via NextAuth.js.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthenticated"
 *       500:
 *         description: Internal server error if there is an issue creating the project.
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
 *     tags: [Projects]
 *     description: Retrieves all projects for the authenticated user's team. The user must be authenticated via NextAuth.js.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of projects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the project.
 *                     example: "project456"
 *                   name:
 *                     type: string
 *                     description: The name of the project.
 *                     example: "Project X"
 *                   teamId:
 *                     type: string
 *                     description: The team that owns the project.
 *                     example: "team123"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the project was created.
 *                     example: "2025-04-05T14:00:00Z"
 *       401:
 *         description: Unauthorized if the user is not authenticated via NextAuth.js.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthenticated"
 *       500:
 *         description: Internal server error if there is an issue retrieving the projects.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

// Create a new project
export async function POST(req) {
  try {
    const { name, teamId } = await req.json();

    // Validation checks
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!teamId) return new NextResponse("Team ID is required", { status: 400 });

    const { currentUser } = await serverAuth();
    if (!currentUser) return new NextResponse("Unauthenticated", { status: 401 });

    // Create the project in the database
    const project = await prismadb.project.create({
      data: {
        name,
        teamId,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.log("[PROJECT_CREATE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Get all projects for a team
export async function GET() {
    try {
      const { currentUser } = await serverAuth();
      if (!currentUser) return new NextResponse("Unauthenticated", { status: 401 });
  
      // Retrieve all projects associated with the team
      const projects = await prismadb.project.findMany({
        where: { teamId: currentUser.teamId }, // Assuming currentUser has teamId
        orderBy: { createdAt: "desc" },
      });
  
      return NextResponse.json(projects);
    } catch (error) {
      console.log("[PROJECTS_RETRIEVE]", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }