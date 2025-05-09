import { useState, useEffect } from "react";
import { UserPlus } from "lucide-react";

import Modal from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import useTeamMembers from '@/hooks/use-team-members';

const AddMemberModal = ({ isOpen, onClose, teamId }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const { mutate: mutateTeamMembers } = useTeamMembers(teamId);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onSave = async () => {
    try {
      if (!username.trim() || !role.trim()) {
        toast.error("Please fill in all fields.");
        return;
      }

      await axios.post(`/api/teams/${teamId}/members`, {
        username,
        role,
      });
      mutateTeamMembers();
      
      toast.success("Member added.");
      onClose();
    } catch (error) {
      toast.error("Failed to add member.");
    } finally {
      setUsername("");
      setRole("");
    }
  };

  const handleClose = () => {
    onClose();
    setUsername("");
    setRole("");
  };

  const saveButton = <Button onClick={onSave}>Add Member</Button>;

  return (
    <Modal
      title="Add Member"
      icon={UserPlus}
      description="Add a new member to your team."
      isOpen={isOpen}
      onClose={handleClose}
      onSave={onSave}
      saveButton={saveButton}
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="col-span-3 focus-visible:ring-primary"
            autoComplete="off"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="role" className="text-right">
            Role
          </Label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="col-span-3 border rounded-md px-3 py-2 focus-visible:ring-primary"
          >
            <option value="">Select a role</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="MEMBER">Member</option>
          </select>
        </div>
      </div>
    </Modal>
  );
};

export default AddMemberModal;
