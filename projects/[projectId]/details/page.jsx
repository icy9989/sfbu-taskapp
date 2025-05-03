"use client"

import { ClipLoader } from "react-spinners";


import { Users } from "lucide-react"
import { useParams } from "next/navigation";
import AddButton from "@/components/add-button";
import MobileAddButton from "@/components/mobile-add-button";

import Tasks from "./components/tasks";

import useTeam from "@/hooks/use-team";

const DetailPage = () => {

    const params = useParams();
    const { data: fetchedTeam, isLoading } = useTeam(params.teamId);

    if(isLoading) {
            return (
                <div className='flex justify-center items-center h-40'>
                    <ClipLoader color='#6b0407' size={28} />
                </div>
            )
        }

  return (
    <> 
        <div className="h-full p-5">
              <div className="flex justify-between items-center border-b">
              <div className="flex justify-between items-center border-b">
                <div className="flex flex-row items-center gap-4 pb-5 border-b">
                      <div className="p-2 rounded-md bg-primary/10">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-zinc-700 flex items-center gap-2">
                          {fetchedTeam.name}
                        </h3>
                        <p className="text-sm text-light text-muted-foreground">
                            {fetchedTeam.description}
                        </p>
                      </div>
                    </div>
                </div>
                <div className="hidden sm:flex">
                    <AddButton href={`/teams/${params.teamId}/details/new`} />
                </div>
              </div>
        
              <div className="my-5 pb-10">
                <Tasks />
             </div>
        
              <div className="sm:hidden mt-10 fixed bottom-5 right-5">
                <MobileAddButton href={`/teams/${params.teamId}/details/new`} />
              </div>
            </div>
    </>
  )
}

export default DetailPage