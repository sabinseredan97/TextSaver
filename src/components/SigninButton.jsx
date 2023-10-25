"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SignInButton({ onClick }) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Button className="hover:bg-purple-600" onClick={() => signIn()}>
        Login
      </Button>
    );
  }

  const title = [
    <Image
      //priority={true}
      key={"img"}
      src={session.user.image}
      alt={session.user.name}
      width={45}
      height={45}
      className="rounded-full mt-1"
    />,
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none text-base" asChild>
        <button className="border-none outline-none hover:none">{title}</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-purple-600">
        <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={"/profile"} onClick={onClick}>
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={"https://github.com/sabinseredan97/TextSaver"}
            rel="noopener noreferrer"
            target="_blank"
            onClick={onClick}
          >
            GitHub
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
