"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useTaskComments from "@/hooks/use-task-comments";
import { formatRelativeTime } from "@/lib/format-relative-time";
import NoResult from "@/components/no-result";
import { ClipLoader } from "react-spinners";
import useCurrentUser from "@/hooks/use-current-user";
import axios from "axios";
import toast from "react-hot-toast";
import useTask from "@/hooks/use-task";

const AddCommentPage = ({ params }) => {
  const { taskId } = params;
  const { data: task, isLoading: taskLoading } = useTask(taskId); 
  const { data: user } = useCurrentUser();
  const { data: comments = [], isLoading, mutate } = useTaskComments(taskId);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await axios.post(`/api/tasks/comments`, {
        taskId,
        userId: user.id,
        comment: newComment,
      });

      setNewComment("");
      mutate();
      toast.success("Comment posted successfully.");
    } catch (error) {
      toast.error("Failed to post comment.");
      console.error("Error posting comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/tasks/comments/${commentId}`);
      mutate();
      toast.success("Comment deleted.");
    } catch (error) {
      toast.error("Failed to delete comment.");
      console.error("Delete error:", error);
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      await axios.put(`/api/tasks/comments/${commentId}`, {
        comment: editedComment,
      });
      setEditingCommentId(null);
      setEditedComment("");
      mutate();
      toast.success("Comment updated.");
    } catch (error) {
      toast.error("Failed to update comment.");
      console.error("Edit error:", error);
    }
  };

  if (isLoading || taskLoading) {
          return (
              <div className="flex justify-center items-center h-72">
                  <ClipLoader color="#6b0407" size={28} />
              </div>
          );
      }

      const formatDateVerbose = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleString("en-US", options);
};


  return (
    <div className="flex flex-col h-full p-5 space-y-4">
      {/* Project Overview */}
      <Card>
        <CardContent className="p-5 space-y-3">
          <div className="text-lg font-semibold">Task overview</div>
          <div className="text-sm grid grid-cols-2 gap-y-2">
          <div>
    <span className="font-medium">Title:</span> {task.title}
  </div>
  <div>
    <span className="font-medium">Status:</span> {task.status}
  </div>
  <div>
    <span className="font-medium">Start date:</span> {formatDateVerbose(task.startDate)}
  </div>
  <div>
    <span className="font-medium">Due date:</span> {formatDateVerbose(task.dueDate)}
  </div>
  <div>
    <span className="font-medium">Priority:</span> {task.priority}
  </div>
  <div>
    <span className="font-medium">Category:</span> {task.category}
  </div>
  <div className="col-span-2">
    <span className="font-medium">Description:</span>{" "}
    <span>{task.description || <span className="text-blue-600 cursor-pointer hover:underline">Add description</span>}</span>
  </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <div className="flex flex-col flex-1 border rounded-xl overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-72">
              <ClipLoader color="#6b0407" size={28} />
            </div>
          ) : comments.length === 0 ? (
            <NoResult text="No comments available." width={200} height={200} />
          ) : (
            comments.map((c, i) => (
              <Card key={i}>
                <CardContent className="flex gap-3 p-4">
                  <Avatar className="w-16 h-16 border-2 border-pink-500">
                    <AvatarImage
                      src={c.user.image || undefined}
                      alt={c.user.username}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {c.user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="text-sm font-semibold">{c.user.name}</p>

                    {editingCommentId === c.id ? (
                      <>
                        <Input
                          value={editedComment}
                          onChange={(e) => setEditedComment(e.target.value)}
                          className="my-2"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleEditComment(c.id)}>Save</Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingCommentId(null)}>Cancel</Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-700">{c.comment}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatRelativeTime(c.timestamp)}
                        </p>

                        {user?.id === c.userId && (
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingCommentId(c.id);
                                setEditedComment(c.comment);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteComment(c.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </>
                    )}
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
