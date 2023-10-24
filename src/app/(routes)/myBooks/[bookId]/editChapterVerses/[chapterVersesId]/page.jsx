"use client";

import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Page() {
  const form = useForm();
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(true);
  const params = useParams();
  const bookId = decodeURIComponent(params.bookId);
  const chapterVersesId = decodeURIComponent(params.chapterVersesId);
  const inputRef = useRef();

  const { data, isLoading, isError } = useQuery({
    queryKey: [`book-chVs-${chapterVersesId}`],
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
  const [editedData, setEditedData] = useState({
    chapter: data?.chaptersverses[0].chapter,
    verses: data?.chaptersverses[0].verses,
  });

  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect(
      `/login?callbackUrl=/myBooks/${encodeURIComponent(
        data.id
      )}/editChapterVerses/${encodeURIComponent(data.chaptersverses[0].id)}`
    );
  }

  function enalbeEdit() {
    setEdit(!edit);
    if (edit) inputRef.current.focus();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editedData.chapter === "") throw new Error("Chapter is required");
      if (editedData.verses === "")
        setEditedData({ ...editedData, verses: null });
      setLoading(true);
      const response = await fetch("/api/edit/chapterVerses", {
        method: "POST",
        body: JSON.stringify({ chapterVersesId, editedData }),
      });
      if (response.status === 201) toast.success("Chapter/s & verse/s edited");
    } catch (error) {
      toast.warn(error.message);
    } finally {
      setEdit(!edit);
      setLoading(false);
    }
  }

  let content;
  if (isLoading) {
    content = <LoadingSpinner />;
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
            <Form {...form}>
              <form className="text-center" onSubmit={(e) => handleSubmit(e)}>
                <FormField
                  control={form.control}
                  name="book"
                  render={() => (
                    <FormItem>
                      <FormLabel>Book</FormLabel>
                      <FormControl>
                        <Input
                          readOnly
                          name="book"
                          type="text"
                          className="form-control"
                          id="book"
                          placeholder="Book"
                          value={data.name}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="mt-2 mb-4" />
                <FormField
                  control={form.control}
                  name="chapter"
                  render={() => (
                    <FormItem>
                      <FormLabel>Chapter/s</FormLabel>
                      <FormControl>
                        <Input
                          readOnly={edit}
                          name="chapter"
                          type="text"
                          className="form-control"
                          id="chapter"
                          placeholder="Chapter"
                          ref={inputRef}
                          defaultValue={data.chaptersverses[0].chapter}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              chapter: e.target.value,
                            })
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="mt-2 mb-4" />
                <FormField
                  control={form.control}
                  name="verse"
                  render={() => (
                    <FormItem>
                      <FormLabel>Verse/s</FormLabel>
                      <FormControl>
                        <Input
                          readOnly={edit}
                          name="verse"
                          type="text"
                          className="form-control"
                          id="verse"
                          placeholder="Verse/s"
                          defaultValue={data.chaptersverses[0].verses}
                          onChange={(e) =>
                            setEditedData({
                              ...editedData,
                              verses: e.target.value,
                            })
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="mt-2 mb-4" />
                {!edit && (
                  <Button type="submit" disabled={loading} className="mt-2">
                    Submit
                  </Button>
                )}
              </form>
              {edit && (
                <div className="text-center mt-2">
                  <Button onClick={enalbeEdit} className="me-2">
                    Edit Ch & Vs
                  </Button>
                </div>
              )}
            </Form>
          )}
        </section>
      ) : (
        content
      )}
    </>
  );
}
