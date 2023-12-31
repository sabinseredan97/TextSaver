"use client";

import { useState } from "react";
import Link from "next/link";
import SignInButton from "./SigninButton";
import { HamburgerMenuIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import NavDropDown from "./NavDropDown";
import { ModeToggle } from "./ModeToggle";

export default function NavBar() {
  const [navbar, setNavbar] = useState(false);
  return (
    <>
      <div>
        <nav className="w-full bg-black fixed top-0 left-0 right-0 z-10">
          <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
            <div>
              <div className="flex items-center justify-between py-3 md:py-5 md:block">
                {/* LOGO */}
                <Link href="/">
                  <h2 className="text-2xl text-purple-600 font-bold ">
                    TextSaver
                  </h2>
                </Link>
                {/* HAMBURGER BUTTON FOR MOBILE */}
                <div className="md:hidden">
                  <Button
                    className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                    onClick={() => setNavbar(!navbar)}
                  >
                    {navbar ? <Cross1Icon /> : <HamburgerMenuIcon />}
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <div
                className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                  navbar ? "p-12 md:p-0 block" : "hidden"
                }`}
              >
                <ul className="h-screen md:h-auto items-center justify-center md:flex ">
                  <li className="pb-6 text-xl text-white py-2 px-6 text-center mt-4 border-b-2 md:border-b-0  hover:bg-purple-600  border-purple-900  md:hover:text-purple-600 md:hover:bg-transparent">
                    <NavDropDown
                      title="Books"
                      label="My Books"
                      create="/create"
                      createTitle="Add Book"
                      list="/myBooks"
                      listTitle="See Books"
                      onClick={() => setNavbar(!navbar)}
                    />
                  </li>
                  <li className="pb-6 text-xl text-white py-2 px-6 text-center mt-4 border-b-2 md:border-b-0  hover:bg-purple-600  border-purple-900  md:hover:text-purple-600 md:hover:bg-transparent">
                    <NavDropDown
                      title="Independent Notes"
                      label="My Independent Notes"
                      create="/createIndependentNote"
                      createTitle="Add Independent Note"
                      list="/myIndependentNotes"
                      listTitle="See Independent Notes"
                      onClick={() => setNavbar(!navbar)}
                    />
                  </li>
                  {/* <li className="pb-6 text-xl text-white py-2 px-6 text-center mt-4 border-b-2 md:border-b-0  hover:bg-purple-600  border-purple-900  md:hover:text-purple-600 md:hover:bg-transparent">
                    <SignInButton onClick={() => setNavbar(!navbar)} />
                  </li> */}
                  <li className="text-white text-center py-6 px-6 md:py-1 border-b-2 md:border-b-0 border-purple-900">
                    <ModeToggle />
                  </li>
                  <li className="text-white text-center py-6 px-6 md:py-1 border-b-2 md:border-b-0 border-purple-900">
                    <SignInButton onClick={() => setNavbar(!navbar)} />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
