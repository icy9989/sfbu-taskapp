import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import DeleteAlertModal from "@/components/modals/delete-alert-modal"
import AddMemberModal from "@/components/modals/add-member-modal"
import useTeams from "@/hooks/use-teams"

const CardAction = ({ id }) => {

    const router = useRouter();
    const [ openDeleteAlert, setOpenDeleteAlert ] = useState(false);
    const [openAddMember, setOpenAddMember] = useState(false)
    const { mutate: mutateTeams} = useTeams();

    const onDelete = async () => {
        try {
            await axios.delete(`/api/teams/${id}`);
            toast.success("Team is successfully deleted.");
            mutateTeams();
        } catch(error) {
            console.log(error);
            toast.error("Something went wrong.");
        } finally {
            setOpenDeleteAlert(false);
        }
    }

    const handleActionClick = (e) => {
        e.stopPropagation(); // Prevents the Link from triggering
    };

  return (
    <>
        <DeleteAlertModal isOpen={openDeleteAlert} onClose={() => setOpenDeleteAlert(false)} onDelete={onDelete} />
        <AddMemberModal isOpen={openAddMember} onClose={() => setOpenAddMember(false)} teamId={id} />
        <DropdownMenu>
        <DropdownMenuTrigger>
                    <Button variant="ghost" className="w-8 h-8 p-0" onClick={handleActionClick}>
                        <MoreHorizontal className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                    Actions
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={(e) => {
  e.stopPropagation(); // Prevent Link navigation
  setOpenAddMember(true);
}}>
  <Edit className="w-4 h-4 mr-2" />
  Add Member
</DropdownMenuItem>

<DropdownMenuItem onClick={(e) => {
  e.stopPropagation(); // Prevent Link navigation
  router.push(`/teams/${id}`);
}}>
  <Edit className="w-4 h-4 mr-2" />
  Update
</DropdownMenuItem>

<DropdownMenuItem onClick={(e) => {
  e.stopPropagation(); // Prevent Link navigation
  setOpenDeleteAlert(true);
}}>
  <Trash className="w-4 h-4 mr-2" />
  Delete
</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>  
  )
}

export default CardAction