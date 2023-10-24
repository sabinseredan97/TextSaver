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
      src={session.user?.image}
      alt={session.user?.name}
      width={28}
      height={28}
      className="rounded-full mr-2"
    />,
    session.user?.name,
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hover:bg-purple-600">
          {title}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-purple-600">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
