import { NextResponse } from "next/server";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/server-auth";

/**
 * @swagger
 * /api/teams/{id}/members/{userId}:
 *   delete:
 *     tags: [Teams]
 *     description: Removes a member from a team. Only the admin (creator) of the team can remove members. Authentication is handled via NextAuth.js.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the team.
 *         schema:
 *           type: string
 *           example: "abc123"
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The unique identifier of the user to be removed from the team.
 *         schema:
 *           type: string
 *           example: "user456"
 *     responses:
 *       200:
 *         description: Successfully removed the member from the team.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Member removed successfully"
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
 *       403:
 *         description: Forbidden if the current user is not the admin of the team.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Forbidden: Only the admin can remove members"
 *       404:
 *         description: Team or member not found if the team or user with the specified ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Team or member not found"
 *       500:
 *         description: Internal server error if there is an issue with removing the team member.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */


// DELETE /api/teams/{id}/members/{userId} → Remove a team member
export async function DELETE(req, { params }) {
  try {
    const { currentUser } = await serverAuth();

    if (!currentUser) return new NextResponse("Unauthenticated", { status: 401 });

    // Find the team to check if the current user is the admin
    const team = await prismadb.team.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!team) return new NextResponse("Team not found", { status: 404 });
    if (team.adminId !== currentUser.id) return new NextResponse("Forbidden: Only the admin can remove members", { status: 403 });

    // Remove the user from the team
    await prismadb.teamMembers.delete({
      where: {
        teamId_userId: {
          teamId: team.id,
          userId: params.userId,
        },
      },
    });

    return new NextResponse("Member removed successfully", { status: 200 });
  } catch (error) {
    console.log("[REMOVE_TEAM_MEMBER]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
