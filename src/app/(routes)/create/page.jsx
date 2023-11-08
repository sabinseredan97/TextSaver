"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";
import {
  Form,
  FormControl,
  FormDescription,
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
  const [data, setData] = useState({
    book: "",
    chapter: "",
    verse: "",
    note: "",
  });

  const { mutate: submitBook, isLoading } = useMutation({
    mutationFn: (e) => handleSubmit(e),
    onSuccess: () => {
      toast.success("Created");
      setData({
        book: "",
        chapter: "",
        verse: "",
        note: "",
      });
      queryClient.invalidateQueries(["myBooks"]);
    },
    onError: (error) => toast.error(error.message),
  });

  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect("/login?callbackUrl=/create");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (data.book === "" || data.chapter === "" || data.note === "")
      throw new Error("Fill the empty fields");
    if (data.verse === "") setData({ ...data, verse: null });

    const response = await fetch("/api/new/book", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.status !== 201)
      throw new Error("A error occured, please try again!");
  }

  return (
    <Form {...form}>
      <form className="text-center" onSubmit={(e) => submitBook(e)}>
        <FormField
          control={form.control}
          name="book"
          render={() => (
            <FormItem>
              <FormLabel>Book</FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => setData({ ...data, book: e.target.value })}
                  name="book"
                  type="text"
                  id="book"
                  placeholder="Book"
                  value={data.book}
                />
              </FormControl>
              <FormDescription>This is your book's name.</FormDescription>
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
                    setData({ ...data, chapter: e.target.value })
                  }
                  name="chapter"
                  type="text"
                  id="chapter"
                  placeholder="Chapter"
                  value={data.chapter}
                />
              </FormControl>
              <FormDescription>This is your book's chapter/s.</FormDescription>
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
                  onChange={(e) => setData({ ...data, verse: e.target.value })}
                  name="verse"
                  type="text"
                  id="verse"
                  placeholder="Verse/s"
                  value={data.verse}
                />
              </FormControl>
              <FormDescription>
                This is your book's and chapter/s verse/s.
              </FormDescription>
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
                  onChange={(e) => setData({ ...data, note: e.target.value })}
                  name="note"
                  id="note"
                  rows={10}
                  placeholder="Note"
                  value={data.note}
                />
              </FormControl>
              <FormDescription>
                This is your note for the book and it also belongs to the
                chapter/s and verse/s.
              </FormDescription>
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
