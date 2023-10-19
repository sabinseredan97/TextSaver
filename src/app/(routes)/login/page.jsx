"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function Page() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

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
          <button
            className="btn btn-primary"
            onClick={async () => await signIn("google", { callbackUrl })}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-icon="google"
              className="mr-8 w-5"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="red"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </section>
  );
}
