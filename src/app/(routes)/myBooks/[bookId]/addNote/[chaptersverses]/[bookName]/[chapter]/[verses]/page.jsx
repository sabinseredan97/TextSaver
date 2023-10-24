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

export default function Page() {
  const form = useForm();
  const params = useParams();
  const bookName = params.bookName;
  const chapter = params.chapter;
  const verses = params.verses;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    bookId: params.bookId,
    chaptersversesId: params.chaptersverses,
    note: "",
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
    try {
      if (data.note === "") throw new Error("Please add a note");
      setIsLoading(true);
      const response = await fetch("/api/new/addNote", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (response.status === 201) toast.success("Note added!");
      setData({
        ...data,
        note: "",
      });
    } catch (error) {
      toast.warn(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
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
                  value={decodeURIComponent(bookName)}
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
                  value={
                    verses !== "null"
                      ? decodeURIComponent(chapter) +
                        ": " +
                        decodeURIComponent(verses)
                      : decodeURIComponent(chapter)
                  }
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
