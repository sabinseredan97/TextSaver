"use client";

import Link from "next/link";
import { NavDropdown } from "react-bootstrap";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "react-bootstrap";
import Image from "next/image";

export default function SignInButton() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Button variant="link" onClick={() => signIn()}>
        Sign In
      </Button>
    );
  }

  const title = [
    <Image
      //priority={true}
      key={"img"}
      src={session.user?.image}
      alt={session.user?.name}
      width={22}
      height={22}
      className="rounded-circle shadow-4-strong me-1 mb-1"
    />,
    session.user?.name,
  ];

  return (
    <NavDropdown title={title || "Account"} id="basic-nav-dropdown">
      <NavDropdown.Item as={Link} href="/profile">
        Profile
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} href="#action/3.2">
        Another action
      </NavDropdown.Item>
      <NavDropdown.Item as={Link} href="#action/3.3">
        Something
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item>
        <Button variant="link" onClick={() => signOut()}>
          <span>Sign Out</span>
        </Button>
      </NavDropdown.Item>
    </NavDropdown>
  );
}
