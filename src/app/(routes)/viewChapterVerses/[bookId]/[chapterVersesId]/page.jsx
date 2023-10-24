"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
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

export default function Page() {
  const params = useParams();
  const bookId = decodeURIComponent(params.bookId);
  const chapterVersesId = decodeURIComponent(params.chapterVersesId);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  let isMobile;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [`book-${bookId}-${chapterVersesId}`],
    queryFn: () =>
      fetch(
        `/api/get/chapterVersesById/${encodeURIComponent(
          bookId
        )}/${encodeURIComponent(chapterVersesId)}`,
        {
          method: "GET",
        }
      ).then((res) => res.json()),
  });

  /* const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/login?callbackUrl=/myBooks/${encodeURIComponent(bookId)}`);
    },
  }); */

  const session = useSession();

  if (session.status === "unauthenticated") {
    //redirect("/login?callbackUrl=/create");
    //return <div className="text-center">Unauthorised</div>;
    redirect(
      `/login?callbackUrl=/viewChapterVerses/${encodeURIComponent(
        bookId
      )}/${encodeURIComponent(chapterVersesId)}`
    );
  }

  async function deleteChapter() {
    try {
      setIsDeleting(true);
      const response = await fetch(
        `/api/delete/chaptersVerses/${chapterVersesId}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        queryClient.cancelQueries([`book-${bookId}-${chapterVersesId}`]);
        refetch();
        toast.success("Chapter & Verse/s Deleted!");
      }
    } catch (error) {
      toast.error("A error occured!");
    } finally {
      setIsDeleting(false);
    }
  }

  let content;
  if (isLoading || isDeleting) {
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
        <section>
          {data && !data.message && (
            <div className="text-center mt-1">
              <Card className="mb-1">
                <CardHeader>
                  <CardTitle className="text-2xl">{data.name}</CardTitle>
                  <CardDescription className="text-xl text-slate-900">
                    Chapter: {data.chaptersverses[0].chapter}
                  </CardDescription>
                  <CardDescription className="text-lg text-slate-600">
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
                            onClick={deleteChapter}
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
                        className="bg-amber-400 hover:bg-amber-300"
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
                        className="bg-green-600 hover:bg-green-500"
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
            </div>
          )}
        </section>
      ) : (
        content
      )}
    </>
  );
}
