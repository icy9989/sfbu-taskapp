import { ClipboardList } from "lucide-react";

import Header from "@/components/header";
import AddButton from "@/components/add-button";
import MobileAddButton from "@/components/mobile-add-button";

import prismadb from "@/lib/prismadb";;

import Tasks from "./components/tasks";

const TasksPage = async () => {

  const taskCount = await prismadb.task.count(); 

  return (
    <div className="h-full p-5">
      <div className="flex justify-between items-center border-b">
        <Header
          title="Create Task"
          description="Here you can create a new task"
          icon={ClipboardList}
          count={taskCount} 
          color="text-primary"
          bgColor="bg-primary/10"
        />
        <div className="hidden sm:flex">
          <AddButton href="/tasks/new" />
        </div>
      </div>

      <div className="my-5 pb-24">
        <Tasks />
      </div>

      <div className="sm:hidden mt-10 fixed bottom-5 right-5">
        <MobileAddButton href="/tasks/new" />
      </div>
    </div>
  );
};

export default TasksPage;
