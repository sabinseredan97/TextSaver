"use client";

import Link from "next/link";
import { NavDropdown } from "react-bootstrap";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "react-bootstrap";

export default function SignInButton() {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <NavDropdown
          title={session.user?.name || "Account"}
          id="basic-nav-dropdown"
        >
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
      ) : (
        <Button variant="link" onClick={() => signIn()}>
          Sign In
        </Button>
      )}
    </>
  );
}
