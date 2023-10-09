"use client";

import GoogleSignInButton from "../components/GoogleSignInButton";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Page() {
  const { data: session } = useSession();

  if (session) {
    redirect("/");
  }

  return (
    <section className="flex min-h-full overflow-hidden pt-16 sm:py-28">
      <div className="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
        <div className="relative mt-12 sm:mt-16">
          <h1 className="text-center text-2xl font-medium tracking-tight text-gray-900">
            Login with Google
          </h1>
        </div>
        <div className="text-center sm:rounded-5xl -mx-4 mt-10 flex-auto bg-white px-5 py-1 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:p-24">
          <GoogleSignInButton />
        </div>
      </div>
    </section>
  );
}
