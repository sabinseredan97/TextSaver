"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { useRef, useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import useGetData from "@/hooks/useGetData";
import useDeleteData from "@/hooks/useDeleteData";
import useEditData from "@/hooks/useEditData";
import NotFound from "@/components/NotFound";

export default function Page() {
  const [editNote, setEditNote] = useState(true);
  const params = useParams();
  const independentNoteId = decodeURIComponent(params.independentNoteId);
  const textareaRef = useRef();
  var editedNote = "";
  let isMobile;

  const fetchQuery = `/api/get/independentNoteById/${encodeURIComponent(
    independentNoteId
  )}`;

  const { data, isLoading, isError } = useGetData(fetchQuery, [
    "myIndependentNotes",
    independentNoteId,
  ]);

  const { mutate: saveEditedNote, isLoading: loading } = useEditData(
    submitEditedNote,
    "Note edited!",
    ["myIndependentNotes", independentNoteId],
    setEditNote
  );

  const navigatePath = "/myIndependentNotes";

  const { mutate: deleteNote, isLoading: isDeleting } = useDeleteData(
    submitDelete,
    "Note deleted!",
    ["myIndependentNotes", independentNoteId],
    navigatePath
  );

  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect(
      `/login?callbackUrl=/viewIndependentNote/${encodeURIComponent(
        independentNoteId
      )}`
    );
  }

  function enableEdit() {
    setEditNote(!editNote);
    if (editNote) textareaRef.current.focus();
  }

  async function submitEditedNote(e) {
    e.preventDefault();
    editedNote = textareaRef.current.value;
    if (editedNote === "") throw new Error("Note cannot be empty!");
    const response = await fetch("/api/edit/independentNote", {
      method: "POST",
      body: JSON.stringify({ independentNoteId, editedNote }),
    });
    if (response.status !== 201)
      throw new Error("A error occured, please try again!");
  }

  async function submitDelete() {
    const response = await fetch(
      `/api/delete/independentNotes/${encodeURIComponent(independentNoteId)}`,
      {
        method: "DELETE",
      }
    );
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
        <section className="w-full text-center">
          {data && !data.message && (
            <Card key={data.id}>
              <CardHeader>
                <CardTitle>{data.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  readOnly={editNote}
                  className="text-lg"
                  rows={isMobile ? 14 : 23}
                  defaultValue={data.text}
                  ref={textareaRef}
                />
                <div className="mt-2">
                  {!editNote ? (
                    <Button
                      onClick={(e) => saveEditedNote(e)}
                      className="me-2"
                      disabled={loading}
                    >
                      Save Note
                    </Button>
                  ) : (
                    <Button onClick={enableEdit} className="me-2">
                      Edit Note
                    </Button>
                  )}
                  <AlertDialog className="me-2">
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={loading}>
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
                          delete your note from our servers.
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
                </div>
              </CardContent>
              <Separator className="mb-4" />
              <CardFooter className="relative">
                <p className="text-sm text-muted-foreground absolute end-1">
                  Created: {new Date(data.createdAt).toDateString()}
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
