"use client";

import { useState } from "react";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";
import useGetData from "@/hooks/useGetData";
import useDeleteData from "@/hooks/useDeleteData";
import NotFound from "@/components/NotFound";

export default function Page() {
  const searchParams = useSearchParams();
  const params = useParams();
  const bookId = decodeURIComponent(params.bookId);
  const [searchInput, setSearchInput] = useState("");

  const page =
    typeof searchParams.get("page") === "string"
      ? parseInt(searchParams.get("page"))
      : 1;
  const limit =
    typeof searchParams.get("limit") === "string"
      ? parseInt(searchParams.get("limit"))
      : 20;

  const fetchQuery = `/api/get/bookById/${bookId}/${page}/${limit}`;

  const { data, isLoading, isError } = useGetData(fetchQuery, [
    "book",
    bookId,
    page,
    limit,
  ]);

  const navigatePath = "/myBooks";

  const { mutate: deleteBook, isLoading: isDeleting } = useDeleteData(
    submitDelete,
    "Book deleted!",
    ["book", bookId],
    navigatePath
  );

  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect(`/login?callbackUrl=/myBooks/${encodeURIComponent(bookId)}`);
  }

  function onChange(e) {
    e.preventDefault();
    setSearchInput(e.target.value);
  }

  async function submitDelete(e) {
    e.preventDefault();
    const response = await fetch(`/api/delete/book/${bookId}`, {
      method: "DELETE",
    });
    if (response.status !== 200)
      throw new Error("A error occured, please try again!");
  }

  let content;
  if (isLoading || isDeleting) {
    content = <LoadingSpinner />;
  } else if (isError || data.message === "Error!") {
    content = <NotFound />;
  }

  return (
    <>
      {!content ? (
        <section>
          {data && !data.message && (
            <div className="text-center mt-1">
              <Card>
                <CardHeader>
                  <CardTitle>{data.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <AlertDialog className="me-2">
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isDeleting}
                        >
                          Delete Book
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your Book and anything related to it from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => deleteBook(e)}
                            disabled={isDeleting}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    {/* <button
                      className="btn btn-danger mb-1 me-1"
                      onClick={deleteBook}
                      disabled={isDeleting}
                    >
                      Delete Book
                    </button> */}
                    <Link href={`/myBooks/${data.id}/addChVers`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-green-700 hover:bg-green-600"
                      >
                        New Chapter/s and Verse/s
                      </Button>
                    </Link>
                  </div>

                  <div className="relative flex items-center text-gray-400 focus-within:text-gray-600 rounded-md p-4 mb-1">
                    <MagnifyingGlassIcon className="w-5 h-5 absolute ml-3 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Search for a chapter"
                      aria-label="Search"
                      onChange={onChange}
                      value={searchInput}
                      className="w-full pr-3 pl-10 py-2"
                    />
                  </div>
                </CardContent>
                <Separator className="mb-4" />
                <CardFooter className="relative">
                  <p className="text-sm text-muted-foreground absolute end-1">
                    Created: {new Date(data.createdAt).toDateString()}
                  </p>
                </CardFooter>
              </Card>
              <Pagination page={page} limit={limit}>
                {data.chaptersverses
                  .filter((chapter) => {
                    return searchInput === ""
                      ? chapter.chapter
                      : chapter.chapter === searchInput;
                  })
                  .map((item) => {
                    return (
                      <Card key={item.id} className="text-center mt-2">
                        <CardHeader>
                          <CardTitle className="text-slate-600">
                            Chapter: {item.chapter}
                          </CardTitle>
                          <CardDescription className="text-slate-500">
                            Verse/s: {item.verses}
                          </CardDescription>
                        </CardHeader>
                        <Link href={`/viewChapterVerses/${data.id}/${item.id}`}>
                          <Button
                            variant="outline"
                            className="bg-emerald-600 hover:bg-emerald-500"
                          >
                            View Chapter/s & Verse/s
                          </Button>
                        </Link>
                        <Separator className="mb-4 mt-2" />
                        <CardFooter className="relative">
                          <p className="text-sm text-muted-foreground absolute end-1">
                            Created: {new Date(item.createdAt).toDateString()}
                          </p>
                        </CardFooter>
                      </Card>
                    );
                  })}
              </Pagination>
            </div>
          )}
        </section>
      ) : (
        content
      )}
    </>
  );
}
