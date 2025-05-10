// app/teams/[teamId]/tasks/[taskId]/comments/page.js
"use client"

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import useTaskComments from "@/hooks/use-task-comments";  // Import the custom hook
import { formatRelativeTime } from "@/lib/format-relative-time";  // Import the time formatting helper

const AddCommentPage = ({ params }) => {
  const { taskId } = params;
  const { comments, isLoading, mutate } = useTaskComments(taskId);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      // API call to add a new comment
      const res = await fetch(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId,
          userId: "user456",  // Example userId, replace with actual userId
          comment: newComment,
        }),
      });

      if (res.ok) {
        const newCommentData = await res.json();
        setNewComment("");  // Reset the input
        mutate();  // Re-fetch the comments
      } else {
        console.error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="flex flex-col h-full p-5 space-y-4">
      {/* Project Overview (could be replaced with actual data) */}
      <Card>
        <CardContent>
          <p className="text-lg">Project Overview</p>
          <div className="grid grid-cols-2 gap-y-2 mt-2">
            <div><strong>Assignee:</strong> Nic Moore</div>
            <div><strong>Status:</strong> Not Started</div>
            <div><strong>Due date:</strong> 14 Jan 2022</div>
            <div><strong>Created by:</strong> Anna Longdon</div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <div className="flex flex-col flex-1 border rounded-xl overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {isLoading ? (
            <p>Loading comments...</p>
          ) : (
            comments?.map((c, i) => (
              <Card key={i}>
                <CardContent className="flex gap-3 p-4">
                  <Avatar>
                    <AvatarFallback>{c.user.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{c.user.username}</p>
                    <p className="text-sm text-gray-700">{c.comment}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeTime(c.timestamp)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Fixed Comment Input */}
        <div className="border-t bg-white p-4 flex gap-2">
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button onClick={handleAddComment}>Post</Button>
        </div>
      </div>
    </div>
  );
};

export default AddCommentPage;
