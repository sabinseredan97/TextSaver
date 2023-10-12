"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function Page() {
  const [editNote, setEditNote] = useState(true);
  const params = useParams();
  const independentNoteId = decodeURIComponent(params.independentNoteId);
  const textareaRef = useRef();
  var editedNote = "";

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [`myIndependentNotes-${independentNoteId}`],
    queryFn: () =>
      fetch(
        `/api/getIndependentNoteById/${encodeURIComponent(independentNoteId)}`,
        {
          method: "GET",
        }
      ).then((res) => res.json()),
  });

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(
        `/login?callbackUrl=/viewIndependentNote/${encodeURIComponent(
          independentNoteId
        )}`
      );
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
      if (editedNote === "") throw new Error("Note cannot be empty!");
      const response = await fetch(`/api/editNote/independentNote`, {
        method: "POST",
        body: JSON.stringify({ independentNoteId, editedNote }),
      });
      if (response.status === 201) toast.success("Note edited");
    } catch (error) {
      toast.warn(error.message);
    } finally {
      setEditNote(!editNote);
    }
  }

  async function deleteNote() {
    try {
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

  return (
    <>
      {!content ? (
        <section>
          {data && !data.message && (
            <div key={data.id} className="card text-center mb-2">
              <div className="card-body">
                <h5 className="card-title">{data.title}</h5>
                <textarea
                  readOnly={editNote}
                  className="card-text form-control"
                  rows={isMobile ? 3 : 5}
                  defaultValue={data.text}
                  ref={textareaRef}
                />
                <div className="text-center mt-2">
                  <button onClick={enalbeEdit} className="btn btn-primary me-2">
                    Edit Note
                  </button>
                  {!editNote && (
                    <button
                      onClick={saveEditedNote}
                      className="btn btn-primary me-2"
                    >
                      Save Note
                    </button>
                  )}
                  <button onClick={deleteNote} className="btn btn-danger me-2">
                    Delete Note
                  </button>
                </div>
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
