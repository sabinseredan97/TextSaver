"use client";

import { useRef } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
  let book = "";
  let chapter = null;
  let verse = null;
  let note = "";
  const bookRef = useRef();
  const chapterRef = useRef();
  const verseRef = useRef();
  const noteRef = useRef();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/create");
    },
  });

  if (!session) {
    //redirect("/login?callbackUrl=/create");
    return <div className="text-center">Unauthorised</div>;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    book = bookRef.current.value;
    chapter = chapterRef.current.value;
    verse = verseRef.current.value;
    note = noteRef.current.value;
    try {
      await fetch(`${env("BASE_URL")}/api/new`, {
        method: "POST",
        body: JSON.stringify({ book, chapter, verse, note }),
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="form-group row">
        <label htmlFor="book" className="col-sm-2 col-form-label">
          Book
        </label>
        <div className="col-sm-10">
          <input
            ref={bookRef}
            name="book"
            type="text"
            className="form-control"
            id="book"
            placeholder="Book"
          />
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor="chapter" className="col-sm-2 col-form-label">
          Chapter/s
        </label>
        <div className="col-sm-10">
          <input
            ref={chapterRef}
            name="chapter"
            type="text"
            className="form-control"
            id="chapter"
            placeholder="Chapter"
          />
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor="verse" className="col-sm-2 col-form-label">
          Verse/s
        </label>
        <div className="col-sm-10">
          <input
            ref={verseRef}
            name="verse"
            type="text"
            className="form-control"
            id="verse"
            placeholder="Verse/s"
          />
        </div>
      </div>

      <div className="form-group row">
        <label htmlFor="note" className="col-sm-2 col-form-label">
          Note
        </label>
        <div className="col-sm-10">
          <textarea
            ref={noteRef}
            name="note"
            className="form-control"
            id="note"
            rows={3}
            placeholder="Note"
          />
        </div>
      </div>
      <div className="text-center mt-2">
        <button type="submit" className="btn btn-secondary">
          Submit
        </button>
      </div>
    </form>
  );
}
