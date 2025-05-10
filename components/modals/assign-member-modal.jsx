import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";

import Modal from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import useTeamMembers from '@/hooks/use-team-members';
import useAssignMembers from '@/hooks/use-assign-members';

const AssignMemberModal = ({ isOpen, onClose, teamId, taskId }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [assignedToId, setAssignedToId] = useState("");
  const { data: teamMembers = [], mutate: mutateTeamMembers } = useTeamMembers(teamId);
  const { mutate: mutateAssignMembers } = useAssignMembers(taskId)

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onSave = async () => {
    try {
      if (!assignedToId) {
        toast.error("Please select a team member.");
        return;
      }

      await axios.post(`/api/tasks/assign`, {
        taskId,
        assignedToId,
      });

      mutateTeamMembers();
      mutateAssignMembers();
      toast.success("Member assigned.");
      onClose();
    } catch (error) {
      toast.error("Failed to assign member.");
    } finally {
      setAssignedToId("");
    }
  };

  const handleClose = () => {
    onClose();
    setAssignedToId("");
  };

  const saveButton = <Button onClick={onSave}>Assign Member</Button>;

  return (
    <Modal
      title="Assign Member"
      icon={UserPlus}
      description="Assign this task to a team member."
      isOpen={isOpen}
      onClose={handleClose}
      onSave={onSave}
      saveButton={saveButton}
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="assignedToId" className="text-right">
            Team Member
          </Label>
          <select
            id="assignedToId"
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
            className="col-span-3 border rounded-md px-3 py-2 focus-visible:ring-primary"
          >
            <option value="">Select a member</option>
            {teamMembers.map((member) => (
              <option key={member.userId} value={member.userId}>
                {member.username}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default AssignMemberModal;
