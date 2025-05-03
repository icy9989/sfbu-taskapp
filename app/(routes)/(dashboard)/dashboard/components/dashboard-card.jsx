import { LucideIcon, User } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const DashboardCard = ({ title, count, iconBg, icon, suffix }) => {
  return (
    <Card>
      <div className="flex justify-between items-center p-5">
        <div>
          <CardTitle className="text-sm font-medium mb-2">
            {title}
          </CardTitle>
          <div className="text-2xl font-bold">
            {count}{suffix && <span className="text-base ml-1">{suffix}</span>}
          </div>
        </div>
        <div className={`p-2 rounded-full ${iconBg}`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

export default DashboardCard 