import { ClipLoader } from 'react-spinners';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Tasks from "./components/tasks";
import Members from "./components/members";

export default function TeamDetailsPage({ params }) {
  const teamId = params.teamId

  return (
    <div className="p-6 space-y-10">
      <div>
          <Members teamId={teamId} />
      </div>

      {/* Team Tasks Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Tasks</h2>
        <Tasks teamId={teamId} />
      </div>
    </div>
  );
}
