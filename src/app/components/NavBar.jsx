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
            <Nav.Link as={Link} href="/create">
              Add Book
            </Nav.Link>
            <Nav.Link as={Link} href="/myBooks">
              My Books
            </Nav.Link>
            {/* <NavDropdown title="Account" id="basic-nav-dropdown">
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
              <NavDropdown.Item as={Link} href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
            <SignInButton />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
