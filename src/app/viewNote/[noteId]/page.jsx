"use client";

import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "react-bootstrap";
import { redirect, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Page() {
  const params = useParams();
  const noteId = decodeURIComponent(params.noteId);
  var editedNote = "";
  const [editNote, setEditNote] = useState(true);
  const textareaRef = useRef();

  const { data, isLoading, error } = useQuery({
    queryKey: [`note-${noteId}`],
    queryFn: () =>
      fetch(`http://localhost:3000/api/getNoteById/${noteId}`, {
        method: "GET",
      }).then((res) => res.json()),
  });

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/login?callbackUrl=/viewNote/${encodeURIComponent(noteId)}`);
    },
  });

  if (!session) {
    //redirect("/login?callbackUrl=/create");
    return <div className="text-center">Unauthorised</div>;
  }

  const isMobile = window.innerWidth < 1200 ? true : false;

  function enalbeEdit() {
    setEditNote(!editNote);
    if (editNote) textareaRef.current.focus();
  }

  async function saveEditedNote() {
    editedNote = textareaRef.current.value;
    try {
      await fetch(`http://localhost:3000/api/editNote`, {
        method: "POST",
        body: JSON.stringify({ noteId, editedNote }),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setEditNote(!editNote);
    }
  }

  if (isLoading)
    return (
      <div className="text-center">
        <Spinner animation="grow" variant="primary" />
        <Spinner animation="grow" variant="warning" />
        <Spinner animation="grow" variant="danger" />
      </div>
    );

  if (error)
    return (
      <div
        className="alert alert-danger d-flex align-items-center"
        role="alert"
      >
        Nothing Found
      </div>
    );

  return (
    <div>
      {data && (
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
            <button onClick={saveEditedNote} className="btn btn-primary">
              Save Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
