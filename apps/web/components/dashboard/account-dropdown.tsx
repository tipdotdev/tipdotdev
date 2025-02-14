"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Code2Icon,
    DollarSignIcon,
    HelpCircleIcon,
    LogOutIcon,
    SettingsIcon,
    StarIcon
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AccountDropdown({ profile }: { profile: any }) {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-fit w-fit rounded-full p-1">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>
                                {profile.username ? profile.username[0].toUpperCase() : "U"}
                            </AvatarFallback>
                            <AvatarImage
                                src={profile.avatar_url}
                                alt={profile.username + "'s avatar"}
                            />
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <SettingsIcon className="mr-2 h-[1rem] w-[1rem]" />
                            Account Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/billing">
                                <DollarSignIcon className="mr-2 h-[1rem] w-[1rem]" />
                                Billing
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="https://github.com/tipdotdev" target="_blank">
                            <Code2Icon className="mr-2 h-[1rem] w-[1rem]" />
                            GitHub
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="https://github.com/tipdotdev/tipdotdev/issues" target="_blank">
                            <HelpCircleIcon className="mr-2 h-[1rem] w-[1rem]" />
                            Support
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/changelog">
                            <StarIcon className="mr-2 h-[1rem] w-[1rem]" />
                            Changelog
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="focus:bg-red-500/20" asChild>
                        <Link href="/auth/sign-out">
                            <LogOutIcon className="mr-2 h-[1rem] w-[1rem]" />
                            Sign out
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
