import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

/**
 * @swagger
 * /api/tasks/comments/{commentId}:
 *   put:
 *     tags: [Tasks]
 *     description: Updates a comment by its ID.
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         description: ID of the comment to update.
 *         schema:
 *           type: string
 *           example: "comment789"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: Updated comment content.
 *                 example: "Updated comment text"
 *     responses:
 *       200:
 *         description: Comment updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment updated successfully"
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Missing comment ID or content.
 *       500:
 *         description: Internal Server Error.
 *
 *   delete:
 *     tags: [Tasks]
 *     description: Deletes a comment by its ID.
 *     parameters:
 *       - name: commentId
 *         in: path
 *         required: true
 *         description: ID of the comment to delete.
 *         schema:
 *           type: string
 *           example: "comment789"
 *     responses:
 *       200:
 *         description: Comment deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comment deleted successfully"
 *       400:
 *         description: Missing comment ID.
 *       500:
 *         description: Internal Server Error.
 */

// PUT: Update a comment
export async function PUT(req, { params }) {
  const { commentId } = params;

  try {
    const { comment } = await req.json();

    if (!commentId || !comment) {
      return new NextResponse("Missing comment ID or content", { status: 400 });
    }

    const updated = await prismadb.comment.update({
      where: { id: commentId },
      data: { comment },
    });

    return NextResponse.json({
      message: "Comment updated successfully",
      comment: updated,
    });
  } catch (error) {
    console.error("[COMMENT_UPDATE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE: Remove a comment
export async function DELETE(req, { params }) {
  const { commentId } = params;

  try {
    if (!commentId) {
      return new NextResponse("Missing comment ID", { status: 400 });
    }

    await prismadb.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("[COMMENT_DELETE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
