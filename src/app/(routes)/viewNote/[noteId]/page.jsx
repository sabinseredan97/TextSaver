"use client";

import { useRef, useState } from "react";
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
import useGetData from "@/hooks/useGetData";
import useDeleteData from "@/hooks/useDeleteData";
import useEditData from "@/hooks/useEditData";
import NotFound from "@/components/NotFound";

export default function Page() {
  const params = useParams();
  const noteId = decodeURIComponent(params.noteId);
  var editedNote = "";
  const [editNote, setEditNote] = useState(true);
  const textareaRef = useRef();
  let isMobile;

  const fetchQuery = `/api/get/noteById/${noteId}`;

  const { data, isLoading, isError } = useGetData(fetchQuery, ["note", noteId]);

  const { mutate: saveEditedNote, isLoading: loading } = useEditData(
    submitEditedNote,
    "Note edited!",
    ["note", noteId],
    setEditNote
  );

  const navigatePath = `/viewChapterVerses/${encodeURIComponent(
    data?.note?.bookId
  )}/${encodeURIComponent(data?.note?.chaptersversesId)}`;

  const { mutate: deleteNote, isLoading: isDeleting } = useDeleteData(
    submitDelete,
    "Note deleted!",
    ["note", noteId],
    navigatePath
  );

  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect(`/login?callbackUrl=/viewNote/${encodeURIComponent(noteId)}`);
  }

  function enalbeEdit() {
    setEditNote(!editNote);
    if (editNote) textareaRef.current.focus();
  }

  async function submitEditedNote(e) {
    e.preventDefault();
    editedNote = textareaRef.current.value;
    if (editedNote === "") throw new Error("Note cannot be empty!");
    const response = await fetch("/api/edit/note", {
      method: "POST",
      body: JSON.stringify({ noteId, editedNote }),
    });
    if (response.status !== 201)
      throw new Error("A error occured, please try again");
  }

  async function submitDelete(e) {
    e.preventDefault();
    const response = await fetch(`/api/delete/note/${noteId}`, {
      method: "DELETE",
    });
    if (response.status !== 200)
      throw new Error("A error occured, please try again!");
  }

  let content;
  if (isLoading) {
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
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-xl">{data.book.name}</CardTitle>
                <CardDescription className="text-lg">
                  {data.book.chaptersverses[0].chapter} {":"}{" "}
                  {data.book.chaptersverses[0].verses}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  className="text-lg"
                  //style={{ width: "100%" }}
                  rows={isMobile ? 12 : 21}
                  readOnly={editNote}
                  defaultValue={data.note.text}
                  ref={textareaRef}
                  //onChange={(e) => setEditedNote(e.target.value)}
                />

                {editNote ? (
                  <Button onClick={enalbeEdit} className="me-2 mt-1">
                    Edit Note
                  </Button>
                ) : (
                  <Button
                    onClick={(e) => saveEditedNote(e)}
                    className="me-2 mt-1"
                    disabled={loading}
                  >
                    Save Note
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="me-1 mt-1"
                      disabled={loading}
                    >
                      Delete Note
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this Note from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => deleteNote(e)}
                        disabled={isDeleting}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
              <Separator className="mb-4" />
              <CardFooter className="relative">
                <p className="text-sm text-muted-foreground absolute end-1">
                  Created: {new Date(data.note.createdAt).toDateString()}
                </p>
              </CardFooter>
            </Card>
          )}
        </section>
      ) : (
        content
      )}
    </>
  );
}
