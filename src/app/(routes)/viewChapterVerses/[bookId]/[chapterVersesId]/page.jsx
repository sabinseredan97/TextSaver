"use client";

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
import { Textarea } from "@/components/ui/textarea";
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
  const chapterVersesId = decodeURIComponent(params.chapterVersesId);
  let isMobile;

  const page =
    typeof searchParams.get("page") === "string"
      ? parseInt(searchParams.get("page"))
      : 1;
  const limit =
    typeof searchParams.get("limit") === "string"
      ? parseInt(searchParams.get("limit"))
      : 20;

  const fetchQuery = `/api/get/chapterVersesById/${encodeURIComponent(
    bookId
  )}/${encodeURIComponent(chapterVersesId)}/${page}/${limit}`;

  const { data, isLoading, isError } = useGetData(fetchQuery, [
    "book",
    bookId,
    chapterVersesId,
    page,
    limit,
  ]);

  const navigatePath = `/myBooks/${encodeURIComponent(bookId)}`;

  const { mutate: deleteChptVs, isLoading: isDeleting } = useDeleteData(
    submitDelete,
    "Chapter & Verse/s Deleted!",
    ["book", bookId, chapterVersesId],
    navigatePath
  );

  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect(
      `/login?callbackUrl=/viewChapterVerses/${encodeURIComponent(
        bookId
      )}/${encodeURIComponent(chapterVersesId)}`
    );
  }

  async function submitDelete(e) {
    e.preventDefault();
    const response = await fetch(
      `/api/delete/chaptersVerses/${chapterVersesId}`,
      {
        method: "DELETE",
      }
    );
    if (response.status !== 200)
      throw new Error("A error occured, please try again!");
  }

  let content;
  if (isLoading || isDeleting) {
    content = <LoadingSpinner />;
  } else if (isError || data.message === "Error!") {
    content = <NotFound />;
  }

  if (typeof window !== "undefined") {
    isMobile = window.innerWidth < 1200 ? true : false;
  }

  return (
    <>
      {!content ? (
        <section>
          {data && !data.message && (
            <div className="text-center mt-1">
              <Card className="mb-1">
                <CardHeader>
                  <CardTitle className="text-2xl">{data.name}</CardTitle>
                  <Separator className="my-4" />
                  <CardDescription className="text-xl">
                    Chapter: {data.chaptersverses[0].chapter}
                  </CardDescription>
                  <CardDescription className="text-base">
                    Verse/s: {data.chaptersverses[0].verses}
                  </CardDescription>
                </CardHeader>
                <Separator className="mb-2" />
                <CardContent>
                  <div className="text-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="me-1 mb-1"
                          disabled={isDeleting}
                        >
                          Delete Chapter & Verse
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this Chapter and any verse/s and notes
                            related to it from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            disabled={isDeleting}
                            onClick={(e) => deleteChptVs(e)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Link
                      href={`/myBooks/${encodeURIComponent(
                        data.id
                      )}/editChapterVerses/${data.chaptersverses[0].id}`}
                      className="me-1"
                    >
                      <Button
                        variant="outline"
                        className="bg-yellow-600 hover:bg-yellow-500"
                      >
                        Edit Chapter & Verse
                      </Button>
                    </Link>
                    <Link
                      href={`/myBooks/${data.id}/addNote/${encodeURIComponent(
                        data.chaptersverses[0].id
                      )}/${encodeURIComponent(data.name)}/${encodeURIComponent(
                        data.chaptersverses[0].chapter
                      )}/${encodeURIComponent(
                        data.chaptersverses[0].verses
                          ? data.chaptersverses[0].verses
                          : null
                      )}`}
                    >
                      <Button
                        variant="outline"
                        className="bg-emerald-800 hover:bg-emerald-700"
                      >
                        Add Note
                      </Button>
                    </Link>
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
                {data.notes.map((note) => {
                  return (
                    <Card className="card mb-2 text-center" key={note.id}>
                      <CardHeader>
                        <CardTitle>Note</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          readOnly
                          rows={isMobile ? 3 : 5}
                          value={note.text}
                        />
                        <Link href={`/viewNote/${encodeURIComponent(note.id)}`}>
                          <Button
                            variant="outline"
                            className="bg-cyan-500 hover:bg-cyan-400 mt-2"
                          >
                            View Note
                          </Button>
                        </Link>
                      </CardContent>
                      <Separator className="mb-4" />
                      <CardFooter className="relative">
                        <p className="text-sm text-muted-foreground absolute end-1">
                          Created: {new Date(note.createdAt).toDateString()}
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
