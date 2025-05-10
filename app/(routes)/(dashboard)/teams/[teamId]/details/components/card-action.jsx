import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import { Copy, Edit, MoreHorizontal, Trash, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import DeleteAlertModal from "@/components/modals/delete-alert-modal"
import useTasks from "@/hooks/use-tasks"
import useTeamTasks from "@/hooks/use-team-tasks"
import AssignMemberModal from "@/components/modals/assign-member-modal"

const CardAction = ({ id, teamId }) => {

    const router = useRouter();
    const [ openDeleteAlert, setOpenDeleteAlert ] = useState(false);
    const [ openAssignAltert, setOpenAssignAlert ] = useState(false);
    const { mutate: mutateTasks} = useTasks();
    const { mutate: mutateTeamTasks } = useTeamTasks(teamId);

    const onDelete = async () => {
        try {
            await axios.delete(`/api/tasks/${id}`);
            toast.success("Task is successfully deleted.");
            mutateTasks();
            mutateTeamTasks();
        } catch(error) {
            console.log(error);
            toast.error("Something went wrong.");
        } finally {
            setOpenDeleteAlert(false);
        }
    }

  return (
    <>
        <DeleteAlertModal isOpen={openDeleteAlert} onClose={() => setOpenDeleteAlert(false)} onDelete={onDelete} />
        <AssignMemberModal isOpen={openAssignAltert} onClose={() => setOpenAssignAlert(false)} teamId={teamId} taskId={id} />
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="ghost" className="w-8 h-8 p-0">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    Actions
                </DropdownMenuLabel>
                 <DropdownMenuItem onClick={() => setOpenAssignAlert(true)}>
                    <User className="w-4 h-4 mr-2" />
                    Assign
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`/teams/${teamId}/details/${id}`)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Update
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenDeleteAlert(true)}>
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>  
  )
}

export default CardAction