"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { redirect, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "react-bootstrap";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function Page() {
  const form = useForm();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    bookId: params.bookId,
    chapter: "",
    verse: "",
    note: "",
  });

  const {
    data: book,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`book-${decodeURIComponent(data.bookId)}`],
    queryFn: () =>
      fetch(`/api/get/bookById/${decodeURIComponent(data.bookId)}`, {
        method: "GET",
      }).then((res) => res.json()),
  });

  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect(
      `/login?callbackUrl=/myBooks/${encodeURIComponent(data.bookId)}/addChVers`
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (data.chapter === "" || data.note === "")
        throw new Error("Fill the empty fields");
      if (data.verse === "") setData({ ...data, verse: null });
      setLoading(true);
      const response = await fetch("/api/new/addChVerse", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setData({ ...data, chapter: "", verse: "", note: "" });
      if (response.status === 201) toast.success("Added!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
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
          {book && !book.message && (
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
                          name="book"
                          type="text"
                          id="book"
                          readOnly
                          value={book.name}
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
                          onChange={(e) =>
                            setData({
                              ...data,
                              chapter: e.target.value,
                            })
                          }
                          name="chapter"
                          type="text"
                          id="chapter"
                          placeholder="Chapter"
                          value={data.chapter}
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
                          onChange={(e) =>
                            setData({
                              ...data,
                              verse: e.target.value,
                            })
                          }
                          name="verse"
                          type="text"
                          id="verse"
                          placeholder="Verse/s"
                          value={data.verse}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="mt-2 mb-4" />
                <FormField
                  control={form.control}
                  name="note"
                  render={() => (
                    <FormItem>
                      <FormLabel>Note</FormLabel>
                      <FormControl>
                        <Textarea
                          onChange={(e) => {
                            setData({
                              ...data,
                              note: e.target.value,
                            });
                          }}
                          name="note"
                          id="note"
                          rows={5}
                          placeholder="Note"
                          value={data.note}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator className="mt-2 mb-4" />
                <Button type="submit" disabled={loading}>
                  Submit
                </Button>
              </form>
            </Form>
          )}
        </section>
      ) : (
        content
      )}
    </>
  );
}
