import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import Image from "next/image";
import { getUser } from "@/services/server-actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/profile");
  }

  const userData = await getUser(session.user.email);

  return (
    <Card className="text-center">
      <div className="bg-purple-500 rounded-t-lg">
        <div className="flex justify-center items-center text-center">
          <Image
            priority={true}
            src={userData.image}
            className="rounded-full mt-1"
            alt={userData.name}
            width={120}
            height={120}
          />
        </div>
        <CardHeader>
          <CardTitle>{userData.name}</CardTitle>
          <CardDescription className="mb-2 text-muted">
            {userData.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="me-1 mt-1"
                //disabled={loading}
              >
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This functionality is not implemented yet, but it will come
                  soon
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                //onClick={deleteNote}
                //disabled={loading}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </div>
      <Separator className="mb-4" />
      <CardFooter className="relative">
        <p className="text-sm text-muted-foreground absolute end-2">
          Thanks for choosing TextSaver
        </p>
      </CardFooter>
    </Card>
  );
}
