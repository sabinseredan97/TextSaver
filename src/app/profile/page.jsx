import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/profile");
  }

  return (
    <section className="py-24">
      <div className="container">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
    </section>
  );
}
