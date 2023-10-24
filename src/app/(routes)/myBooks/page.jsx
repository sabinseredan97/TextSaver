"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
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
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Page() {
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myBooks"],
    queryFn: () =>
      fetch("/api/get/allBooks", {
        method: "GET",
      }).then((res) => res.json()),
  });

  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect("/login?callbackUrl=/create");
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

  return (
    <>
      {!content ? (
        <section>
          {data && !data.message && (
            <div>
              <div className="relative flex items-center text-gray-400 focus-within:text-gray-600 rounded-md border p-4 mb-2">
                <MagnifyingGlassIcon className="w-5 h-5 absolute ml-3 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search for a Book"
                  onChange={onChange}
                  value={searchInput}
                  className="w-full pr-3 pl-10 py-2"
                />
              </div>
              <div>
                {data
                  .filter((item) => {
                    return searchInput.toLowerCase() === ""
                      ? item.name
                      : item.name
                          .toLowerCase()
                          .includes(searchInput.toLowerCase());
                  })
                  .map((item) => {
                    return (
                      <Card className="card text-center mb-2" key={item.id}>
                        <CardHeader>
                          <CardTitle>{item.name}</CardTitle>
                          {/* <CardDescription>
                            You have 3 unread messages.
                          </CardDescription> */}
                        </CardHeader>
                        <CardContent>
                          <Link href={`myBooks/${encodeURIComponent(item.id)}`}>
                            <Button variant="outline">View</Button>
                          </Link>
                        </CardContent>
                        <Separator className="mb-4" />
                        <CardFooter className="relative">
                          <p className="text-sm text-muted-foreground absolute end-1">
                            Created: {new Date(item.createdAt).toDateString()}
                          </p>
                        </CardFooter>
                      </Card>
                    );
                  })}
              </div>
            </div>
          )}
        </section>
      ) : (
        content
      )}
    </>
  );
}
