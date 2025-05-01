import { useEffect, useState } from "react"

import { AlertTriangle } from "lucide-react"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

const DeleteAlertModal = ({ isOpen, onClose, onDelete }) => {

  const [ isMounted, setIsMounted ] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  },[]);

  if(!isMounted) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="flex flex-col justify-center items-center">
        <AlertDialogHeader>
          <div className="mx-auto">
            <AlertTriangle className="w-12 h-12 text-red-600"/>
          </div>
          <AlertDialogTitle className="text-center">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This action cannot be undone. This will permanently delete your data and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-center items-center gap-4">
          <AlertDialogCancel className="m-0">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteAlertModal