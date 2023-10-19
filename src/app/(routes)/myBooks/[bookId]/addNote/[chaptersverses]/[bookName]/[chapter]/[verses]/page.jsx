"use client";
import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
  const params = useParams();
  const bookName = params.bookName;
  const chapter = params.chapter;
  const verses = params.verses;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    bookId: params.bookId,
    chaptersversesId: params.chaptersverses,
    note: "",
  });

  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect(
      `/login?callbackUrl=/myBooks/${encodeURIComponent(
        data.bookId
      )}/addNote/${encodeURIComponent(
        data.chaptersversesId
      )}/${encodeURIComponent(bookName)}/${encodeURIComponent(
        chapter
      )}/${encodeURIComponent(verses)}`
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (data.note === "") throw new Error("Please add a note");
      setIsLoading(true);
      const response = await fetch("/api/new/addNote", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (response.status === 201) toast.success("Note added!");
      setData({
        ...data,
        note: "",
      });
    } catch (error) {
      toast.warn(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="form-group row">
        <label htmlFor="book" className="col-sm-2 col-form-label">
          Book
        </label>
        <div className="col-sm-10">
          <input
            readOnly
            value={decodeURIComponent(bookName)}
            name="book"
            type="text"
            className="form-control"
            id="book"
            placeholder="Book"
          />
        </div>
      </div>

      <div className="form-group row mt-1">
        <label htmlFor="chapter" className="col-sm-2 col-form-label">
          Chapter/s & Verse/s
        </label>
        <div className="col-sm-10">
          <input
            readOnly
            value={
              verses !== "null"
                ? decodeURIComponent(chapter) +
                  ": " +
                  decodeURIComponent(verses)
                : decodeURIComponent(chapter)
            }
            name="chapter"
            type="text"
            className="form-control"
            id="chapter"
            placeholder="Chapter"
          />
        </div>
      </div>

      <div className="form-group row mt-1">
        <label htmlFor="note" className="col-sm-2 col-form-label">
          Note
        </label>
        <div className="col-sm-10">
          <textarea
            onChange={(e) =>
              setData({
                ...data,
                note: e.target.value,
              })
            }
            name="note"
            className="form-control"
            id="note"
            rows={5}
            placeholder="Note"
            value={data.note}
          />
        </div>
      </div>
      <div className="text-center mt-2">
        <button
          onClick={(e) => handleSubmit(e)}
          disabled={isLoading}
          className="btn btn-secondary"
        >
          Submit
        </button>
      </div>
    </>
  );
}
