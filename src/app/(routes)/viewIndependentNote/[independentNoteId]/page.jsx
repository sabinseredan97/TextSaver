"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
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

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [editNote, setEditNote] = useState(true);
  const params = useParams();
  const independentNoteId = decodeURIComponent(params.independentNoteId);
  const textareaRef = useRef();
  var editedNote = "";
  let isMobile;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [`myIndependentNotes-${independentNoteId}`],
    queryFn: () =>
      fetch(
        `/api/get/independentNoteById/${encodeURIComponent(independentNoteId)}`,
        {
          method: "GET",
        }
      ).then((res) => res.json()),
  });

  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect(
      `/login?callbackUrl=/viewIndependentNote/${encodeURIComponent(
        independentNoteId
      )}`
    );
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
      const response = await fetch("/api/edit/independentNote", {
        method: "POST",
        body: JSON.stringify({ independentNoteId, editedNote }),
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
      const response = await fetch(
        `/api/delete/independentNotes/${encodeURIComponent(independentNoteId)}`,
        {
          method: "DELETE",
        }
      );
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
        <section className="w-full text-center">
          {data && !data.message && (
            <Card key={data.id}>
              <CardHeader>
                <CardTitle>{data.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  readOnly={editNote}
                  className="text-sm text-muted-foreground"
                  rows={isMobile ? 17 : 30}
                  defaultValue={data.text}
                  ref={textareaRef}
                />
                <div className="mt-2">
                  {!editNote ? (
                    <Button
                      onClick={saveEditedNote}
                      className="me-2"
                      disabled={loading}
                    >
                      Save Note
                    </Button>
                  ) : (
                    <Button onClick={enalbeEdit} className="me-2">
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
                          onClick={deleteNote}
                          disabled={loading}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      ) : (
        content
      )}
    </>
  );
}
