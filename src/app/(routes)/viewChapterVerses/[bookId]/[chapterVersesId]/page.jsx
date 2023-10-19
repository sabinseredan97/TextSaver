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
  const bookId = decodeURIComponent(params.bookId);
  const chapterVersesId = decodeURIComponent(params.chapterVersesId);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  let isMobile;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [`book-${bookId}-${chapterVersesId}`],
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

  /* const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/login?callbackUrl=/myBooks/${encodeURIComponent(bookId)}`);
    },
  }); */

  const session = useSession();

  if (session.status === "unauthenticated") {
    //redirect("/login?callbackUrl=/create");
    //return <div className="text-center">Unauthorised</div>;
    redirect(
      `/login?callbackUrl=/viewChapterVerses/${encodeURIComponent(
        bookId
      )}/${encodeURIComponent(chapterVersesId)}`
    );
  }

  async function deleteChapter() {
    try {
      setIsDeleting(true);
      const response = await fetch(
        `/api/delete/chaptersVerses/${chapterVersesId}`,
        {
          method: "DELETE",
        }
      );
      if (response.status === 200) {
        queryClient.cancelQueries([`book-${bookId}-${chapterVersesId}`]);
        refetch();
        toast.success("Chapter & Verse/s Deleted!");
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

  if (typeof window !== "undefined") {
    isMobile = window.innerWidth < 1200 ? true : false;
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
                <div
                  key={data.chaptersverses[0].id}
                  className="card text-center mb-2"
                >
                  <div className="card-body">
                    <h5 className="card-title">
                      Chapter: {data.chaptersverses[0].chapter}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      Verse/s: {data.chaptersverses[0].verses}
                    </h6>
                    <button
                      className="btn btn-outline-danger mb-2 me-1"
                      disabled={isDeleting}
                      onClick={deleteChapter}
                    >
                      Delete Chapter & Verse
                    </button>
                    <Link
                      href={`/myBooks/${encodeURIComponent(
                        data.id
                      )}/editChapterVerses/${data.chaptersverses[0].id}`}
                      className="btn btn-outline-warning mb-2 me-1"
                    >
                      Edit Chapter & Verse
                    </Link>
                    <Link
                      href={`/myBooks/${data.id}/addNote/${encodeURIComponent(
                        data.chaptersverses[0].id
                      )}/${encodeURIComponent(data.name)}/${encodeURIComponent(
                        data.chaptersverses[0].chapter
                      )}/${encodeURIComponent(
                        data.chaptersverses[0].verses
                          ? data.chaptersverses[0].verses
                          : null
                      )}`}
                      className="card-link btn btn-outline-success mb-2"
                    >
                      Add Note
                    </Link>
                    <h6 className="card mb-2 mt-2">Notes</h6>
                    {data.notes.map((note) => {
                      return (
                        <div className="card mb-2 text-center" key={note.id}>
                          <textarea
                            readOnly
                            className="card-text form-control"
                            rows={isMobile ? 3 : 5}
                            value={note.text}
                          />
                          <div className="text-center mt-1 mb-1">
                            <Link
                              href={`/viewNote/${encodeURIComponent(note.id)}`}
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
