import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/");
  }

  return (
    <>
      <Card className="mb-2">
        <CardHeader>
          <CardTitle>Add Book</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            Here you can add a new book, each book can have many notes that you
            can add any time, all books that you add will be saved to your
            profile.
          </p>
          <Link href="/create">
            <Button>Add a new book</Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="mb-2">
        <CardHeader>
          <CardTitle>My Books</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            Here you can see a list of your books, click on a book and you can
            delete it or add more notes to it.
          </p>
          <Link href="/myBooks">
            <Button variant="outline">See your books</Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="mb-2">
        <CardHeader>
          <CardTitle>Add Independent Note</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            Independent notes are just notes you want to add about anything,
            they doesn't belong to anything but your account
          </p>
          <Link href="/createIndependentNote">
            <Button>Add a independent note</Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="mb-2">
        <CardHeader>
          <CardTitle>My Independent Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            Here you can see you Independent Notes, click on a note and you can
            delete it or edit it.
          </p>
          <Link href="/myIndependentNotes">
            <Button variant="outline">See your independent notes</Button>
          </Link>
        </CardContent>
      </Card>
    </>
  );
}
