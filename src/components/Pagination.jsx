"use client";

import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export default function Pagination({ children, page, limit }) {
  const router = useRouter();
  const pathname = usePathname();
  const [itemsLimit, setItemsLimit] = useState(20);

  const query = {
    page: page,
    limit: limit,
  };

  function handleClick() {
    if (!itemsLimit || itemsLimit < 1) {
      return;
    }
    router.push(`${pathname}?page=${query.page}&limit=${itemsLimit}`);
  }

  return (
    <>
      <p className="text-center text-sm mt-1">
        Choose how many items to display on the page
      </p>
      <div className="flex mt-2 mb-2">
        <div className="w-full">
          <HoverCard>
            <HoverCardTrigger>
              <Input
                className="rounded-none rounded-l-lg"
                type="number"
                id="itemsLimit"
                placeholder={`${limit} items currently displayed on the page`}
                onChange={(e) => setItemsLimit(e.target.value)}
              />
            </HoverCardTrigger>
            <HoverCardContent>
              Here you can add a limit to the items that are displayed on the
              page. The current value is {query.limit}.
              <p className="text-amber-600">
                If you set a large limit while on a different page than the
                first one you might get{" "}
                <span className="flex-nowrap">"Nothing Found"</span>, if that
                happens go to the first page, you can set any limit to the first
                page.
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>
        <Button
          variant="secondary"
          className="rounded-none rounded-r-lg px-2"
          onClick={handleClick}
        >
          Set Limit
        </Button>
        <Link
          href={{
            pathname: `${pathname}`,
            query: {
              ...query,
              page: page > 1 ? page - 1 : 1,
            },
          }}
          className={clsx(
            "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-none rounded-l-lg ms-2",
            page <= 1 && "pointer-events-none opacity-50"
          )}
        >
          Prev.
        </Link>
        <p className="border border-input bg-transparent shadow-sm h-9 px-4 py-2 rounded-none">
          {query.page}
        </p>
        <Link
          href={{
            pathname: `${pathname}`,
            query: {
              ...query,
              page: page + 1,
            },
          }}
          className="border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 rounded-none rounded-r-lg"
        >
          Next
        </Link>
      </div>
      {children}
    </>
  );
}
