import { UserPlus, UserCog } from "lucide-react"

import Header from "@/components/header"

import AddTeam from "./components/add-team"
import EditTeam from "./components/edit-team"

const TeamPage = ({ params }) => {

  return (
    <> 
       <div className="h-full p-5">
            <div className="flex justify-between items-center border-b">
                <Header
                    title={params.teamId === "new" ? "Add New Team" : "Edit Team"}
                    description={params.teamId === "new" ? "Create a new task to do" : "Update the details in your existing task"}
                    icon={params.teamId === "new" ? UserPlus : UserCog}
                />
            </div>
            <div className="my-5 pb-10">
                {params.teamId === "new" ? <AddTeam /> : <EditTeam />}
            </div>
        </div>
    </>
  )
}

export default TeamPage