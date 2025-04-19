import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const Header = ({ title, description, icon: Icon, count, border, color, bgColor }) => {
  return (
    <div className={cn("flex flex-row items-center gap-4 pb-5", border ? "border-b" : "")}>
      <div className={cn("p-2 rounded-md", bgColor ? bgColor : "bg-primary/10")}>
        <Icon className={cn("w-8 h-8", color ? color : "text-primary")} />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-zinc-700 flex items-center gap-2">
          {title}
          {count && <Badge>{count}</Badge>} 
        </h3>
        <p className="text-sm text-light text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export default Header