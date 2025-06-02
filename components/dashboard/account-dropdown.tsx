"use client";

import { getStripeDashboardLink } from "@/actions/stripe";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import {
    BadgeDollarSignIcon,
    Code2Icon,
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
                    <Button variant="ghost" className="h-fit w-fit rounded-md border p-1">
                        {/* <CircleEllipsisIcon className="text-muted-foreground/80" /> */}

                        <Avatar className="h-8 w-8 rounded-sm">
                            <AvatarFallback>
                                {profile?.username ? profile?.username[0].toUpperCase() : "U"}
                            </AvatarFallback>
                            <AvatarImage
                                src={profile?.avatarUrl}
                                alt={profile?.username + "'s avatar"}
                                className="rounded-sm"
                            />
                        </Avatar>
                        <span className="text-sm font-normal text-muted-foreground">
                            @{profile?.username}
                        </span>
                        <DotsVerticalIcon className="h-[1rem] w-[1rem] text-muted-foreground/60" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/settings">
                                <SettingsIcon className="mr-2 h-[1rem] w-[1rem]" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={async () => {
                                const url = await getStripeDashboardLink(profile?.userId);
                                window.open(url, "_blank");
                            }}
                        >
                            <BadgeDollarSignIcon className="mr-2 h-[1rem] w-[1rem]" />
                            Stripe Dashboard
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
