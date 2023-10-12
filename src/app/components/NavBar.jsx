"use client";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import Link from "next/link";
import SignInButton from "./SigninButton";

export default function NavBar() {
  return (
    <Navbar expand="lg" className="px-2 bg-body-tertiary fixed-top">
      <Container>
        <Navbar.Brand as={Link} href="/">
          TextSaver
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Books" id="basic-nav-dropdown">
              <Link
                //as={Link}
                className="btn btn-outline-dark ms-2"
                href="/create"
              >
                Add Book
              </Link>
              <NavDropdown.Divider />
              <Link
                //as={Link}
                className="btn btn-outline-dark ms-2"
                href="/myBooks"
              >
                My Books
              </Link>
            </NavDropdown>
            <NavDropdown title="Independent Notes" id="basic-nav-dropdown">
              <Link
                //as={Link}
                className="btn btn-outline-dark ms-2 me-2"
                href="/createIndependentNote"
              >
                Add Independent Note
              </Link>
              <NavDropdown.Divider />
              <Link
                //as={Link}
                className="btn btn-outline-dark ms-2 me-2"
                href="/myIndepenentNotes"
              >
                My Independent Notes
              </Link>
            </NavDropdown>
            <SignInButton />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
