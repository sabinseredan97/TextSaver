"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { redirect, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

export default function Page() {
  const params = useParams();
  const bookId = params.bookId;
  const [searchInput, setSearchInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [`book-${decodeURIComponent(bookId)}`],
    queryFn: () =>
      fetch(`/api/getBookById/${decodeURIComponent(bookId)}`, {
        method: "GET",
      }).then((res) => res.json()),
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
      setIsDeleting(true);
      await fetch(`/api/delete/book/${decodeURIComponent(bookId)}`, {
        method: "DELETE",
      });
      queryClient.cancelQueries([`book-${decodeURIComponent(bookId)}`]);
      refetch();
    } catch (error) {
      toast.error("A error occured!");
    } finally {
      setIsDeleting(false);
      toast.success("Book deleted!");
    }
  }

  let content;
  if (isLoading || isDeleting) {
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
            <div className="card text-center mt-1">
              <div className="card-header">Book</div>
              <div className="card-body">
                <h5 className="card-title">{data.name}</h5>
                <div className="text-center">
                  <Link
                    href={`/myBooks/${data.id}/addChVers`}
                    className="card-link btn btn-success me-1 mb-1"
                  >
                    New Chapter/s and Verse/s
                  </Link>
                  <button className="btn btn-danger mb-1" onClick={deleteBook}>
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
                          <h5 className="card-title">
                            Chapter: {item.chapter}
                          </h5>
                          <h6 className="card-subtitle mb-2 text-muted">
                            Verse/s: {item.verses}
                          </h6>
                          <h6 className="card mb-2 mt-2">Notes</h6>
                          <Link
                            href={`/myBooks/${
                              data.id
                            }/addNote/${encodeURIComponent(
                              item.id
                            )}/${encodeURIComponent(
                              data.name
                            )}/${encodeURIComponent(
                              item.chapter
                            )}/${encodeURIComponent(
                              item.verses ? item.verses : null
                            )}`}
                            className="card-link btn btn-success mb-2"
                          >
                            Add Note
                          </Link>
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
                        </div>
                      </div>
                    );
                  })}
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
