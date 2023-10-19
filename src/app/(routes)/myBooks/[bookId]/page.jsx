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
      fetch(`/api/get/bookById/${decodeURIComponent(bookId)}`, {
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

  function onChange(e) {
    e.preventDefault();
    setSearchInput(e.target.value);
  }

  async function deleteBook() {
    try {
      setIsDeleting(true);
      const response = await fetch(
        `/api/delete/book/${decodeURIComponent(bookId)}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        queryClient.cancelQueries([`book-${decodeURIComponent(bookId)}`]);
        refetch();
        toast.success("Book deleted!");
      }
    } catch (error) {
      toast.error("A error occured!");
    } finally {
      setIsDeleting(false);
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
                  <button
                    className="btn btn-danger mb-1 me-1"
                    onClick={deleteBook}
                    disabled={isDeleting}
                  >
                    Delete Book
                  </button>
                  <Link
                    href={`/myBooks/${data.id}/addChVers`}
                    className="card-link btn btn-success mb-1"
                  >
                    New Chapter/s and Verse/s
                  </Link>
                </div>

                <input
                  type="text"
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
                          <Link
                            href={`/viewChapterVerses/${data.id}/${item.id}`}
                            className="btn btn-outline-warning"
                          >
                            View Chapter & Notes
                          </Link>
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
