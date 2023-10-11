"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Spinner } from "react-bootstrap";

export default function Page() {
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["myBooks"],
    queryFn: () =>
      fetch(`/api/getBooks`, {
        method: "GET",
      }).then((res) => res.json()),
  });

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect(`/login?callbackUrl=/myBooks`);
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
            <section>
              <input
                type="search"
                className="form-control mr-sm-2 mb-2 mt-1"
                placeholder="Search for a word"
                aria-label="Search"
                onChange={onChange}
                value={searchInput}
              />
              <div>
                {data
                  .filter((item) => {
                    return searchInput.toLowerCase() === ""
                      ? item.name
                      : item.name
                          .toLowerCase()
                          .includes(searchInput.toLowerCase());
                  })
                  .map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="card text-center mb-2"
                        //style={{ width: "18rem" }}
                      >
                        <div className="card-body">
                          <h5 className="card-title">{item.name}</h5>
                          <Link
                            href={`myBooks/${encodeURIComponent(item.id)}`}
                            className="card-link btn btn-info me-1"
                          >
                            View
                          </Link>
                          {/* <Link href="#" className="card-link">
                            Another link
                          </Link> */}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>
          )}
        </section>
      ) : (
        content
      )}
    </>
  );
}
