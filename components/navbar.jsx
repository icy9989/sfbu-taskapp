"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

import { ChevronDown, PartyPopper, User, Contact, Edit, UserCog, KeyRound, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import MobileSidebar from "@/components/mobile-sidebar";
import CustomTooltip from "@/components/custom-tooltip";

import EditProfileModal from "@/components/modals/edit-profile-modal";
import ChangePasswordModal from '@/components/modals/change-password-modal';

import useCurrentUser from "@/hooks/use-current-user";


const Navbar = () => {
  
  const [ openEditProfile, setOpenEditProfile ] = useState(false);
  const [ openChangePassword, setOpenChangePassword ] = useState(false);

  const { data: session } = useSession();
  const { data: currentUser } = useCurrentUser();


  return (
    <>
      {currentUser && (
        <>
          <EditProfileModal isOpen={openEditProfile} onClose={() => setOpenEditProfile(false)} currentUser={currentUser} />
          <ChangePasswordModal isOpen={openChangePassword} onClose={() => setOpenChangePassword(false)} />
        </>
      )}
      <div className="py-3 px-5 flex flex-row items-center border-b w-full fixed lg:pr-[296px] bg-white z-50">
          <MobileSidebar />
          <h5 className="text-lg font-semibold text-primary flex flex-row items-center gap-2">
            <PartyPopper />Hello, {currentUser?.name}
          </h5>
          <div className="ml-auto flex flex-row items-center gap-2">
              <p className="hidden sm:flex text-sm text-muted-foreground">{currentUser?.username}</p>
              <CustomTooltip
                text="view profile"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://github.com/shadcn.png" alt="profile" />
                  <AvatarFallback>
                    <span className="bg-primary text-white w-full h-full flex justify-center items-center">{session?.user?.name?.charAt(0)}</span>
                  </AvatarFallback>
                </Avatar>
              </CustomTooltip>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <ChevronDown className="w-4 h-4 text-muted-foreground cursor-pointer focus-visible:ring-0" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="my-2 mx-6">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem disabled>
                      <User className="w-4 h-4 mr-2"/>
                      <span>{currentUser?.name}</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Edit className="h-4 w-4 mr-2" />
                      <span>Edit</span>
                    </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem onClick={() => setOpenEditProfile(true)}>
                            <UserCog className="mr-2 h-4 w-4" />
                            <span>Edit profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setOpenChangePassword(true)}>
                            <KeyRound className="mr-2 h-4 w-4" />
                            <span>Change password</span>
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="w-4 h-4 mr-2"/>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>            
          </div>
      </div>
    </>
  )
}

export default Navbar