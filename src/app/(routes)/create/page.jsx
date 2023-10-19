"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    book: "",
    chapter: "",
    verse: "",
    note: "",
  });

  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect("/login?callbackUrl=/create");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (data.book === "" || data.chapter === "" || data.note === "")
        throw new Error("Fill the empty fields");
      setIsLoading(true);
      if (data.verse === "") setData({ ...data, verse: null });

      const response = await fetch("/api/new/book", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setData({
        book: "",
        chapter: "",
        verse: "",
        note: "",
      });
      if (response.status === 201) toast.success("Created!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="form-group row mb-1">
        <label htmlFor="book" className="col-sm-2 col-form-label">
          Book
        </label>
        <div className="col-sm-10">
          <input
            onChange={(e) => setData({ ...data, book: e.target.value })}
            name="book"
            type="text"
            className="form-control"
            id="book"
            placeholder="Book"
            value={data.book}
          />
        </div>
      </div>

      <div className="form-group row mb-1">
        <label htmlFor="chapter" className="col-sm-2 col-form-label">
          Chapter/s
        </label>
        <div className="col-sm-10">
          <input
            onChange={(e) => setData({ ...data, chapter: e.target.value })}
            name="chapter"
            type="text"
            className="form-control"
            id="chapter"
            placeholder="Chapter"
            value={data.chapter}
          />
        </div>
      </div>

      <div className="form-group row mb-1">
        <label htmlFor="verse" className="col-sm-2 col-form-label">
          Verse/s
        </label>
        <div className="col-sm-10">
          <input
            onChange={(e) => setData({ ...data, verse: e.target.value })}
            name="verse"
            type="text"
            className="form-control"
            id="verse"
            placeholder="Verse/s"
            value={data.verse}
          />
        </div>
      </div>

      <div className="form-group row mb-1">
        <label htmlFor="note" className="col-sm-2 col-form-label">
          Note
        </label>
        <div className="col-sm-10">
          <textarea
            onChange={(e) => setData({ ...data, note: e.target.value })}
            name="note"
            className="form-control"
            id="note"
            rows={10}
            placeholder="Note"
            value={data.note}
          />
        </div>
      </div>
      <div className="text-center mt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-secondary"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
