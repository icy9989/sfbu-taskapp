import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/teams:
 *   post:
 *     tags: [Teams]
 *     description: Creates a new team and associates it with the creator (admin). The creator becomes the first member of the team as an admin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the team.
 *                 example: "Development Team"
 *               description:
 *                 type: string
 *                 description: A brief description of the team.
 *                 example: "A team responsible for software development."
 *     responses:
 *       200:
 *         description: Successfully created a new team and assigned the creator as the admin.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the team.
 *                   example: "abc123"
 *                 name:
 *                   type: string
 *                   description: The name of the team.
 *                   example: "Development Team"
 *                 description:
 *                   type: string
 *                   description: A brief description of the team.
 *                   example: "A team responsible for software development."
 *                 adminId:
 *                   type: string
 *                   description: The unique identifier of the user who created the team and is the admin.
 *                   example: "xyz456"
 *       400:
 *         description: Bad request if the team name is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Team name is required"
 *       500:
 *         description: Internal server error if there is an issue with creating the team.
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
 *     tags: [Teams]
 *     description: Retrieves all teams where the current user is a member or the creator.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of teams.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the team.
 *                     example: "abc123"
 *                   name:
 *                     type: string
 *                     description: The name of the team.
 *                     example: "Development Team"
 *                   description:
 *                     type: string
 *                     description: A brief description of the team.
 *                     example: "A team responsible for software development."
 *                   adminId:
 *                     type: string
 *                     description: The unique identifier of the user who created the team and is the admin.
 *                     example: "xyz456"
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
 *         description: Internal server error if there is an issue with fetching the teams.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */

// POST /api/teams - Create a new team
export async function POST(req) {
  try {
    const { name, description } = await req.json();

    // Authentication - Check if the user is authenticated
    const { currentUser } = await serverAuth(req);  // Pass the request to serverAuth()

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Validate input
    if (!name) {
      return new NextResponse("Team name is required", { status: 400 });
    }

    // Create the team and associate it with the creator (admin)
    const team = await prismadb.team.create({
      data: {
        name,
        description,
        adminId: currentUser.id,
      },
    });

    // Add the creator as the first member (admin)
    await prismadb.teamMembers.create({
      data: {
        teamId: team.id,
        userId: currentUser.id,
        role: "ADMIN", // The user is the team admin by default
      },
    });

    // Return the newly created team
    return NextResponse.json(team);
  } catch (error) {
    console.error("[TEAM_CREATE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// GET /api/teams - Retrieve all teams where the current user is a member or the creator
export async function GET(req) {
  try {
    // Authentication - Get the authenticated user
    const { currentUser } = await serverAuth(req);  // Pass the request to serverAuth()

    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find all teams where the current user is a member or the creator
    const teams = await prismadb.team.findMany({
      where: {
        OR: [
          { adminId: currentUser.id },  // Created teams
          { members: { some: { userId: currentUser.id } } },  // Teams the user is part of
        ],
      },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("[TEAMS_LIST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
