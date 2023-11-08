"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
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
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function Page() {
  const queryClient = useQueryClient();
  const form = useForm();
  const [data, setData] = useState({
    title: "",
    note: "",
  });

  const { mutate: submitNote, isLoading } = useMutation({
    mutationFn: (e) => handleSubmit(e),
    onSuccess: () => {
      toast.success("Created");
      setData({
        title: "",
        note: "",
      });
      queryClient.invalidateQueries(["myIndependentNotes"]);
    },
    onError: (error) => toast.error(error.message),
  });

  const session = useSession();

  if (session.status === "unauthenticated") {
    redirect("/login?callbackUrl=/create");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (data.title === "" || data.note === "")
      throw new Error("Fill the empty fields");
    const response = await fetch("/api/new/addIndependentNote", {
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  name="title"
                  type="text"
                  id="title"
                  placeholder="Title"
                  value={data.title}
                />
              </FormControl>
              <FormDescription>This is your note's title.</FormDescription>
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
                  //id="note"
                  rows={17}
                  placeholder="Note"
                  value={data.note}
                />
              </FormControl>
              <FormDescription>This is your note's content.</FormDescription>
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
