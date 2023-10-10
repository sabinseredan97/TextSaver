"use client";

import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "react-bootstrap";

export default function Page() {
  const params = useParams();
  const bookId = params.bookId;
  const [searchInput, setSearchInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: [`book-${decodeURIComponent(bookId)}`],
    queryFn: () =>
      fetch(
        `${env("BASE_URL")}/api/getBookById/${decodeURIComponent(bookId)}`,
        {
          method: "GET",
        }
      ).then((res) => res.json()),
  });

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/login?callbackUrl=/myBooks/${encodeURIComponent(bookId)}`);
    },
  });

  if (!session) {
    //redirect("/login?callbackUrl=/create");
    return <div className="text-center">Unauthorised</div>;
  }

  const isMobile = window.innerWidth < 1200 ? true : false;

  function onChange(e) {
    e.preventDefault();
    setSearchInput(e.target.value);
  }

  async function deleteBook() {
    try {
      await fetch(
        `${env("BASE_URL")}/api/delete/book/${decodeURIComponent(bookId)}`,
        {
          method: "DELETE",
        }
      );
      setIsDeleting(true);
    } catch (error) {
      setIsDeleting(false);
    } finally {
      if (isDeleting) setShouldRedirect(true);
      setIsDeleting(false);
    }
  }

  if (shouldRedirect && !isDeleting) redirect("/myBooks?callbackUrl=/myBooks");

  if (isLoading || isDeleting)
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
    <>
      {data && (
        <div className="card text-center mt-1">
          <div className="card-header">Book</div>
          <div className="card-body">
            <h5 className="card-title">{data.name}</h5>
            <div className="text-center">
              <Link
                href={`/myBooks/${data.id}/addChVers`}
                className="card-link btn btn-link"
              >
                New Chapter/s and Verse/s
              </Link>
              <button className="btn btn-danger" onClick={deleteBook}>
                Delete Book
              </button>
            </div>

            <input
              type="number"
              className="form-control mr-sm-2 mb-2 mt-1"
              placeholder="Search for a chapter"
              aria-label="Search"
              onChange={onChange}
              value={searchInput}
            />

            {data.chaptersverses
              .filter((chapter) => {
                return searchInput === ""
                  ? chapter.chapter
                  : chapter.chapter === searchInput;
              })
              .map((item) => {
                return (
                  <div key={item.id} className="card text-center mb-2">
                    <div className="card-body">
                      <h5 className="card-title">Chapter: {item.chapter}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">
                        Verse/s: {item.verses}
                      </h6>
                      <h6 className="card mb-2 mt-2">Notes</h6>
                      {data.notes
                        .filter((note) => item.id === note.chaptersversesId)
                        .map((filteredNote) => {
                          return (
                            <div
                              className="card mb-2 text-center"
                              key={filteredNote.id}
                            >
                              <textarea
                                readOnly
                                className="card-text form-control"
                                rows={isMobile ? 3 : 5}
                                value={filteredNote.text}
                              />
                              <div className="text-center mt-1 mb-1">
                                <Link
                                  href={`/viewNote/${encodeURIComponent(
                                    filteredNote.id
                                  )}`}
                                  className="card-link btn btn-dark"
                                >
                                  View Note
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      <Link
                        href={`/myBooks/${data.id}/addNote/${encodeURIComponent(
                          item.id
                        )}/${encodeURIComponent(
                          data.name
                        )}/${encodeURIComponent(
                          item.chapter
                        )}/${encodeURIComponent(
                          item.verses ? item.verses : null
                        )}`}
                        className="card-link btn btn-link"
                      >
                        Add Note
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
}
