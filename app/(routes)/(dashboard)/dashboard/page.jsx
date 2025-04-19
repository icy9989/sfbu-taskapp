"use client";

import Header from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";
import useTaskCompletionDashboardCard from "@/hooks/use-taskcompletion-dashboard";
import { LayoutDashboard } from "lucide-react";
import DashboardCard from "./components/dashboard-card";

const cards = [
  {
    id: 1,
    iconBg: "bg-purple-400",
    icon: 
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
  
  },
  {
    id: 2,
    iconBg: "bg-orange-400",
    icon: 
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
  },
  {
    id: 3,
    iconBg: "bg-emerald-400",
    icon: 
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
  }

]

const Dashboard = ({ children }) => {

  const { data: cardData, isLoading: cardLoading } = useTaskCompletionDashboardCard();

    return (
      <div className="h-full p-5 bg-slate-50/10">
      <Header
        title="Dashboard"
        description="This is your task dashboard, showing an overview of total tasks, 
        completed work, and progress tracking to help you stay organized and productive."
        icon={LayoutDashboard}
        color="text-primary"
        bgColor="bg-primary/10"
      /> 
       <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-5">
       {
  cardLoading ? (
    cards.map((card) => (
      <div key={card.id} className="flex flex-col space-y-3">
        <Skeleton className="h-[100px] items-center rounded-lg border-2 bg-white">
          <div className="flex justify-between items-center space-x-4 p-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[50px]" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </Skeleton>
      </div>
    ))
  ) : (
    cardData?.map((data, index) => (
      <DashboardCard
        key={index}
        title={data.title}
        count={data.value}
        iconBg={cards[index]?.iconBg}
        icon={cards[index]?.icon}
      />
    ))
  )
}
      </div>  
      </div>
    )
}
  
export default Dashboard