import { LucideIcon } from "lucide-react"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const Modal = ({ title, icon:Icon, description, isOpen, onClose, onSave, saveButton, children }) => {

    const onChange = (open) => {
        if(!open) {
            onClose();
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex flex-row items-center">
                        <Icon className="w-10 h-10 p-1 rounded-md text-primary bg-primary/10 mr-2" />
                        <h3 className="text-2xl font-bold">{title}</h3>
                    </DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div>
                    {children}
                </div>
                <DialogFooter>
                    {saveButton}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default Modal