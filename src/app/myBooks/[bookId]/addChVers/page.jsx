"use client";

import { useState } from "react";
import { redirect, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Page() {
  const params = useParams();
  const [data, setData] = useState({
    bookId: params.bookId,
    chapter: null,
    verse: null,
    note: null,
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

    await fetch(`/api/addChVerse`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  return (
    <section>
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
          />
        </div>
      </div>
      <div className="text-center mt-1">
        <button onClick={(e) => handleSubmit(e)} className="btn btn-secondary">
          Submit
        </button>
      </div>
    </section>
  );
}
