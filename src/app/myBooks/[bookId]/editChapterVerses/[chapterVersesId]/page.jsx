"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(true);
  const params = useParams();
  const bookId = decodeURIComponent(params.bookId);
  const chapterVersesId = decodeURIComponent(params.chapterVersesId);
  const inputRef = useRef();

  const { data, isLoading, isError } = useQuery({
    queryKey: [`book-chVs-${chapterVersesId}`],
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
  const [editedData, setEditedData] = useState({
    chapter: data?.chaptersverses[0].chapter,
    verses: data?.chaptersverses[0].verses,
  });

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(
        `/login?callbackUrl=/myBooks/${encodeURIComponent(
          data.id
        )}/editChapterVerses/${encodeURIComponent(data.chaptersverses[0].id)}`
      );
    },
  });

  if (!session) {
    //redirect("/login?callbackUrl=/create");
    return <div className="text-center">Unauthorised</div>;
  }

  function enalbeEdit() {
    setEdit(!edit);
    if (edit) inputRef.current.focus();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editedData.chapter === "") throw new Error("Chapter is required");
      if (editedData.verses === "")
        setEditedData({ ...editedData, verses: null });
      setLoading(true);
      const response = await fetch("/api/edit/chapterVerses", {
        method: "POST",
        body: JSON.stringify({ chapterVersesId, editedData }),
      });
      if (response.status === 201) toast.success("Chapter/s & verse/s edited");
    } catch (error) {
      toast.warn(error.message);
    } finally {
      setEdit(!edit);
      setLoading(false);
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
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="form-group row mb-1">
                <label htmlFor="book" className="col-sm-2 col-form-label">
                  Book
                </label>
                <div className="col-sm-10">
                  <input
                    readOnly
                    name="book"
                    type="text"
                    className="form-control"
                    id="book"
                    placeholder="Book"
                    value={data.name}
                  />
                </div>
              </div>

              <div className="form-group row mb-1">
                <label htmlFor="chapter" className="col-sm-2 col-form-label">
                  Chapter/s
                </label>
                <div className="col-sm-10">
                  <input
                    readOnly={edit}
                    name="chapter"
                    type="text"
                    className="form-control"
                    id="chapter"
                    placeholder="Chapter"
                    ref={inputRef}
                    defaultValue={data.chaptersverses[0].chapter}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        chapter: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-group row mb-1">
                <label htmlFor="verse" className="col-sm-2 col-form-label">
                  Verse/s
                </label>
                <div className="col-sm-10">
                  <input
                    readOnly={edit}
                    name="verse"
                    type="text"
                    className="form-control"
                    id="verse"
                    placeholder="Verse/s"
                    defaultValue={data.chaptersverses[0].verses}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        verses: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="text-center mt-2">
                {!edit && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-secondary"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
          )}
          {edit && (
            <div className="text-center mt-2">
              <button onClick={enalbeEdit} className="btn btn-primary me-2">
                Edit Ch & Vs
              </button>
            </div>
          )}
        </section>
      ) : (
        content
      )}
    </>
  );
}
