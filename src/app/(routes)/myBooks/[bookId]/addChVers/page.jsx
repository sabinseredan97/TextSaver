"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { redirect, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import LoadingSpinner from "@/components/LoadingSpinner";
import useGetData from "@/hooks/useGetData";
import NotFound from "@/components/NotFound";

export default function Page() {
  const queryClient = useQueryClient();
  const form = useForm();
  const params = useParams();
  const [data, setData] = useState({
    bookId: decodeURIComponent(params.bookId),
    chapter: "",
    verse: "",
    note: "",
  });

  const fetchQuery = `/api/get/bookById/${data.bookId}`;

  const {
    data: book,
    isLoading,
    isError,
  } = useGetData(fetchQuery, ["book", data.bookId]);

  const { mutate: addChptVs, isLoading: loading } = useMutation({
    mutationFn: (e) => handleSubmit(e),
    onSuccess: () => {
      toast.success("Added!");
      setData({ ...data, chapter: "", verse: "", note: "" });
      queryClient.invalidateQueries(["book", data.bookId]);
    },
    onError: (error) => toast.error(error.message),
  });

  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect(
      `/login?callbackUrl=/myBooks/${encodeURIComponent(data.bookId)}/addChVers`
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (data.chapter === "" || data.note === "")
      throw new Error("Fill the empty fields");
    if (data.verse === "") setData({ ...data, verse: null });
    const response = await fetch("/api/new/addChVerse", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.status !== 201)
      throw new Error("A error occured, please try again!");
  }

  let content;
  if (isLoading) {
    content = <LoadingSpinner />;
  } else if (isError || data.message === "Error!") {
    content = <NotFound />;
  }

  return (
    <>
      {!content ? (
        <section>
          {book && !book.message && (
            <Form {...form}>
              <form className="text-center" onSubmit={(e) => addChptVs(e)}>
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
