"use client";

import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "react-bootstrap";
import { redirect, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

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
            <div className="card">
              <h5 className="card-header">{data.book.name}</h5>
              <div className="card-body">
                <h5 className="card-title">
                  {data.book.chaptersverses[0].chapter} {":"}{" "}
                  {data.book.chaptersverses[0].verses}
                </h5>
                <textarea
                  className="card-text form-control"
                  style={{ width: "100%" }}
                  rows={isMobile ? 17 : 27}
                  readOnly={editNote}
                  defaultValue={data.note.text}
                  ref={textareaRef}
                  //onChange={(e) => setEditedNote(e.target.value)}
                ></textarea>
              </div>
              <div className="text-center">
                <button onClick={enalbeEdit} className="btn btn-primary me-2">
                  Edit Note
                </button>
                {!editNote && (
                  <button
                    onClick={saveEditedNote}
                    className="btn btn-primary me-2"
                    disabled={loading}
                  >
                    Save Note
                  </button>
                )}
                <button
                  onClick={deleteNote}
                  disabled={loading}
                  className="btn btn-danger me-2"
                >
                  Delete Note
                </button>
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
