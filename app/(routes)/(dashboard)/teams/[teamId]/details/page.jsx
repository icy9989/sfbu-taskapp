import Tasks from "./components/tasks";
import Members from "./components/members";
import Header from "@/components/header";
import AddButton from "@/components/add-button";
import MobileAddButton from "@/components/mobile-add-button";
import { ClipboardList } from "lucide-react";

export default function TeamDetailsPage({ params }) {
  const teamId = params.teamId

  return (
    <div className="h-full p-5">
          <div className="flex justify-between items-center border-b">
            <Header
              title="Create Task"
              description="Here you can create a new task"
              icon={ClipboardList}
              // count={taskCount ? taskCount : "0"} 
              color="text-primary"
              bgColor="bg-primary/10"
            />
            <div className="hidden sm:flex">
              <AddButton href={`/teams/${teamId}/details/new`} />
            </div>
          </div>
    
          <div className="my-5 pb-24">
              <div className="mb-5">
                <Members teamId={teamId} />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Tasks</h2>
                <Tasks teamId={teamId} />
              </div>
          </div>
    
          <div className="sm:hidden mt-10 fixed bottom-5 right-5">
            <MobileAddButton href="/tasks/new" />
          </div>
        </div>
  );
}
