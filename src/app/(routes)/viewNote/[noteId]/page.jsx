"use client";

import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "react-bootstrap";
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

export default function Page() {
  const params = useParams();
  const noteId = decodeURIComponent(params.noteId);
  var editedNote = "";
  const [editNote, setEditNote] = useState(true);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef();
  let isMobile;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [`note-${noteId}`],
    queryFn: () =>
      fetch(`/api/get/noteById/${noteId}`, {
        method: "GET",
      }).then((res) => res.json()),
  });

  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect(`/login?callbackUrl=/viewNote/${encodeURIComponent(noteId)}`);
  }

  function enalbeEdit() {
    setEditNote(!editNote);
    if (editNote) textareaRef.current.focus();
  }

  async function saveEditedNote() {
    editedNote = textareaRef.current.value;
    try {
      if (editedNote === "") throw new Error("Note cannot be empty!");
      setLoading(true);
      const response = await fetch("/api/edit/note", {
        method: "POST",
        body: JSON.stringify({ noteId, editedNote }),
      });
      if (response.status === 201) toast.success("Note edited");
    } catch (error) {
      toast.warn(error.message);
    } finally {
      setEditNote(!editNote);
      setLoading(false);
    }
  }

  async function deleteNote() {
    try {
      setLoading(true);
      const response = await fetch(`/api/delete/note/${noteId}`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        toast.success("Note deleted!");
        refetch();
      }
    } catch (error) {
      setLoading(false);
      toast.error("A error occured!");
    }
  }

  let content;
  if (isLoading) {
    content = (
      <div className="mt-5 text-center">
        <Spinner animation="grow" variant="primary" />
        <Spinner animation="grow" variant="warning" />
        <Spinner animation="grow" variant="danger" />
      </div>
    );
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
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-xl">{data.book.name}</CardTitle>
                <CardDescription className="text-lg">
                  {data.book.chaptersverses[0].chapter} {":"}{" "}
                  {data.book.chaptersverses[0].verses}
                </CardDescription>
              </CardHeader>
              <CardContent className="card-body">
                <Textarea
                  className="card-text form-control"
                  style={{ width: "100%" }}
                  rows={isMobile ? 17 : 27}
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
                    onClick={saveEditedNote}
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
                        onClick={deleteNote}
                        disabled={loading}
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
