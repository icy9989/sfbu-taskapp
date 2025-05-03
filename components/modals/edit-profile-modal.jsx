"use client";

import { useEffect, useState } from "react";
import { UserCog } from "lucide-react";

import Modal from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import useCurrentUser from "@/hooks/use-current-user";

const EditProfileModal = ({ isOpen, onClose, currentUser }) => {
  const [isMounted, setIsMounted] = useState(false);
  const { mutate: mutateCurrentUser } = useCurrentUser();

  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onSave = async () => {
    try {
      // Send PUT request to update only name and username
      await axios.patch(`/api/users/${currentUser.id}`, {
        name,
        username,
      });

      toast.success("Profile updated.");

      mutateCurrentUser();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
    setName(currentUser.name);
    setUsername(currentUser.username);
  };

  const saveButton = <Button onClick={onSave}>Save changes</Button>;

  return (
    <Modal isOpen={isOpen}
    onClose={handleClose}
    title="Edit Profile"
    icon={UserCog}
    description="Update your name and username.">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Profile</h2>
        </div>

        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>

        <div className="flex justify-end mt-4 space-x-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {saveButton}
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
