"use client";

import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { useState } from "react";
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
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function Page() {
  const queryClient = useQueryClient();
  const form = useForm();
  const params = useParams();
  const bookName = decodeURIComponent(params.bookName);
  const chapter = decodeURIComponent(params.chapter);
  const verses = decodeURIComponent(params.verses);
  const [data, setData] = useState({
    bookId: decodeURIComponent(params.bookId),
    chaptersversesId: decodeURIComponent(params.chaptersverses),
    note: "",
  });

  const { mutate: submitNote, isLoading } = useMutation({
    mutationFn: (e) => handleSubmit(e),
    onSuccess: () => {
      toast.success("Note added!");
      setData({ ...data, note: "" });
      queryClient.invalidateQueries(["book", data.bookId]);
    },
    onError: (error) => toast.error(error.message),
  });

  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect(
      `/login?callbackUrl=/myBooks/${encodeURIComponent(
        data.bookId
      )}/addNote/${encodeURIComponent(
        data.chaptersversesId
      )}/${encodeURIComponent(bookName)}/${encodeURIComponent(
        chapter
      )}/${encodeURIComponent(verses)}`
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (data.note === "") throw new Error("Please add a note");
    const response = await fetch("/api/new/addNote", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.status !== 201)
      throw new Error("A error occured, please try again!");
  }

  return (
    <Form {...form}>
      <form className="text-center" onSubmit={(e) => submitNote(e)}>
        <FormField
          control={form.control}
          name="book"
          render={() => (
            <FormItem>
              <FormLabel>Book</FormLabel>
              <FormControl>
                <Input
                  readOnly
                  value={bookName}
                  name="book"
                  type="text"
                  className="form-control"
                  id="book"
                  placeholder="Book"
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
              <FormLabel>Chapter/s & Verse/s</FormLabel>
              <FormControl>
                <Input
                  readOnly
                  value={verses !== "null" ? chapter + ": " + verses : chapter}
                  name="chapter"
                  type="text"
                  className="form-control"
                  id="chapter"
                  placeholder="Chapter"
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
                  onChange={(e) =>
                    setData({
                      ...data,
                      note: e.target.value,
                    })
                  }
                  name="note"
                  className="form-control"
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
        <Button type="submit" disabled={isLoading}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
