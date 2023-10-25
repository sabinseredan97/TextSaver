"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { CheckIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { nanoid } from "nanoid";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Page() {
  const [searchInput, setSearchInput] = useState("");
  let isMobile;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myIndependentNotes"],
    queryFn: () =>
      fetch(`/api/get/independentNotes`, {
        method: "GET",
      }).then((res) => res.json()),
  });

  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect(`/login?callbackUrl=/myIndependentNotes`);
  }

  function onChange(e) {
    e.preventDefault();
    setSearchInput(e.target.value);
  }

  let content;
  if (isLoading) {
    content = <LoadingSpinner />;
  } else if (isError || data.message === "Error!") {
    content = (
      <div
        className="alert alert-danger d-flex align-items-center"
        role="alert"
      >
        Nothing Found
      </div>
    );
  }

  if (typeof window !== "undefined") {
    isMobile = window.innerWidth < 1200 ? true : false;
  }

  return (
    <>
      {!content ? (
        <section className="text-center">
          {data && !data.message && (
            <div className="text-center">
              <Card className="mt-1">
                <CardHeader>
                  <CardTitle>Independent Notes</CardTitle>
                  <CardDescription>
                    Here you can see all your notes
                  </CardDescription>
                </CardHeader>
                <CardContent className="gap-4">
                  <div className="relative flex items-center text-gray-400 focus-within:text-gray-600 rounded-md border p-4">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute ml-3 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Search for a title"
                      onChange={onChange}
                      value={searchInput}
                      className="w-full pr-3 pl-10 py-2"
                    />
                  </div>
                  <div>
                    {data
                      .filter((searchItem) => {
                        return searchInput.toLowerCase() === ""
                          ? searchItem.title
                          : searchItem.title
                              .toLowerCase()
                              .includes(searchInput.toLowerCase());
                      })
                      .map((item) => (
                        <React.Fragment key={nanoid()}>
                          <div key={item.id} className="mb-4 text-center">
                            <br />
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {item.title}
                              </p>

                              <Textarea
                                readOnly
                                rows={isMobile ? 3 : 5}
                                value={item.text}
                              />
                              <div className="relative">
                                <p className="text-sm text-muted-foreground absolute end-1">
                                  {new Date(item.createdAt).toDateString()}
                                </p>
                              </div>
                              <Link
                                href={`viewIndependentNote/${encodeURIComponent(
                                  item.id
                                )}`}
                              >
                                <Button className="mt-1">View</Button>
                              </Link>
                            </div>
                          </div>
                          <Separator className="my-4" />
                        </React.Fragment>
                      ))}
                  </div>
                </CardContent>
                <Separator className="mb-4" />
                <CardFooter className="relative">
                  {/* <Button className="w-full">
                    <CheckIcon className="mr-2 h-4 w-4" /> Mark all as read
                  </Button> */}
                  <p className="text-sm text-muted-foreground absolute end-1">
                    Thanks for using TextSaver
                  </p>
                </CardFooter>
              </Card>
            </div>
          )}
        </section>
      ) : (
        content
      )}
    </>
  );
}
