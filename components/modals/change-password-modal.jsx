"use client";

import { useState, useEffect } from "react"

import { Eye, EyeOff, KeyRound } from "lucide-react"

import Modal from "@/components/ui/modal"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";

const ChangePasswordModal = ({ isOpen, onClose }) => {

  const [ isMounted, setIsMounted ] = useState(false);
  const [ password, setPassword ] = useState("");
  const [ confirmPassword, setConfirmPassword ] = useState("");
  const [ passwordShow, setPasswordShow ] = useState(false);
  const [ confirmPasswordShow, setConfirmPasswordShow ] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  },[]);

  if(!isMounted) {
    return null;
  }

  const onSave = async () => {
    try {

      if(password !== confirmPassword) {
        toast.error("Enter password correctly.")
        return;
      }

      await axios.patch("/api/user", {
        password
      })

      toast.success("Password changed.");

      signOut();
      
    } catch(error) {
      toast.error("Something went wrong");
    } finally {
      onClose();
      setPassword("");
      setConfirmPassword("");
    }
  }

  const handleClose = () => {
    onClose();
    setPassword("");
    setConfirmPassword("");
  }

  const saveButton = (
    <Button onClick={onSave}>Save changes</Button>
  )

  const PasswordEye = passwordShow ? EyeOff : Eye;
  const ConfirmPasswordEye = confirmPasswordShow ? EyeOff : Eye;

  return (
    <Modal
      title="Change Password"
      icon={KeyRound}
      description="Make changes to your profile here. Click save when you're done."
      isOpen={isOpen}
      onClose={handleClose}
      onSave={onSave}
      saveButton={saveButton}
    >
      <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              New Password
            </Label>
            <div className="relative col-span-3">
              <Input
                id="password"
                type={passwordShow ? "text" : "password"}
                defaultValue={password}
                autoComplete="off"
                className="focus-visible:ring-primary"
                onChange={(e) => setPassword(e.target.value)}
              />
              <PasswordEye 
                onClick={() => setPasswordShow(!passwordShow)}
                className="w-4 h-4 text-muted-foreground absolute right-2 top-3 cursor-pointer"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Confirm password
            </Label>
            <div className="relative col-span-3">
              <Input
                id="confirm-password"
                type={confirmPasswordShow ? "text" : "password"}
                defaultValue={confirmPassword}
                autoComplete="off"
                className="focus-visible:ring-primary"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <ConfirmPasswordEye 
                onClick={() => setConfirmPasswordShow(!confirmPasswordShow)}
                className="w-4 h-4 text-muted-foreground absolute right-2 top-3 cursor-pointer"
              />
            </div>
          </div>
        </div>
    </Modal>
  )
}

export default ChangePasswordModal