"use client";

import { useState } from "react";
import { redirect, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function Page() {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    bookId: params.bookId,
    chapter: "",
    verse: "",
    note: "",
  });

  const {
    data: book,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`book-${decodeURIComponent(data.bookId)}`],
    queryFn: () =>
      fetch(`/api/getBookById/${decodeURIComponent(data.bookId)}`, {
        method: "GET",
      }).then((res) => res.json()),
  });

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(
        `/login?callbackUrl=/myBooks/${encodeURIComponent(
          data.bookId
        )}/addChVers`
      );
    },
  });

  if (!session) {
    //redirect("/login?callbackUrl=/create");
    return <div className="text-center">Unauthorised</div>;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (data.chapter === "" || data.note === "")
        throw new Error("Fill the empty fields");
      if (data.verse === "") setData({ ...data, verse: null });
      setLoading(true);
      const response = await fetch(`/api/addChVerse`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      setData({ ...data, chapter: "", verse: "", note: "" });
      if (response.status === 201) toast.success("Added!");
    } catch (error) {
      toast.error(error.message);
    } finally {
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
          {book && !book.message && (
            <div>
              <div className="form-group row">
                <label htmlFor="book" className="col-sm-2 col-form-label">
                  Book
                </label>
                <div className="col-sm-10">
                  <input
                    name="book"
                    type="text"
                    className="form-control"
                    id="book"
                    readOnly
                    value={book.name}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="chapter" className="col-sm-2 col-form-label">
                  Chapter/s
                </label>
                <div className="col-sm-10">
                  <input
                    onChange={(e) =>
                      setData({
                        ...data,
                        chapter: e.target.value,
                      })
                    }
                    name="chapter"
                    type="text"
                    className="form-control"
                    id="chapter"
                    placeholder="Chapter"
                    value={data.chapter}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="verse" className="col-sm-2 col-form-label">
                  Verse/s
                </label>
                <div className="col-sm-10">
                  <input
                    onChange={(e) =>
                      setData({
                        ...data,
                        verse: e.target.value,
                      })
                    }
                    name="verse"
                    type="text"
                    className="form-control"
                    id="verse"
                    placeholder="Verse/s"
                    value={data.verse}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label htmlFor="note" className="col-sm-2 col-form-label">
                  Note
                </label>
                <div className="col-sm-10">
                  <textarea
                    onChange={(e) => {
                      setData({
                        ...data,
                        note: e.target.value,
                      });
                    }}
                    name="note"
                    className="form-control"
                    id="note"
                    rows={5}
                    placeholder="Note"
                    value={data.note}
                  />
                </div>
              </div>
              <div className="text-center mt-1">
                <button
                  onClick={(e) => handleSubmit(e)}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Submit
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
