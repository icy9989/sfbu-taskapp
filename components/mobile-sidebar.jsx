import { useEffect, useState } from "react";

import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Sidebar from "@/components/sidebar"

const MobileSidebar = () => {

  const [ isMounted, setIsMounted ] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  },[]);

  if(!isMounted) {
    return null;
  }

  return (
    <Sheet>
        <SheetTrigger>
            <Menu className="w-8 h-8 bg-slate-50 text-muted-foreground p-1 rounded-md lg:hidden mr-3"/>
        </SheetTrigger>
        <SheetContent side="left" className="m-0 p-0">
            <Sidebar />
        </SheetContent>
    </Sheet>
  )
}

export default MobileSidebar