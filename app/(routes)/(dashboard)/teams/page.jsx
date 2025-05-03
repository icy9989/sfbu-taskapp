import { Users } from "lucide-react";

import Header from "@/components/header";
import AddButton from "@/components/add-button";
import MobileAddButton from "@/components/mobile-add-button";

import prismadb from "@/lib/prismadb";;

import Teams from "./components/teams";

const TeamsPage = async () => {

  const teamCount = await prismadb.team.count(); 

  return (
    <div className="h-full p-5">
      <div className="flex justify-between items-center border-b">
        <Header
          title="Create Team"
          description="Here you can create a new team"
          icon={Users}
          count={teamCount ? teamCount : "0"} 
          color="text-primary"
          bgColor="bg-primary/10"
        />
        <div className="hidden sm:flex">
          <AddButton href="/teams/new" />
        </div>
      </div>

      <div className="my-5 pb-24">
        <Teams />
      </div>

      <div className="sm:hidden mt-10 fixed bottom-5 right-5">
        <MobileAddButton href="/teams/new" />
      </div>
    </div>
  );
};

export default TeamsPage;
