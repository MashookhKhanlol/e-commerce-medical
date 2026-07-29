"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
}

/**
 * Client component island — uses useRouter to push search param updates
 * without a full navigation. The only client-side component in the listing.
 */
export function SearchBar({
  initialQuery = "",
  placeholder = "Search medicines, brands...",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }

      // Preserve existing category filter
      startTransition(() => {
        router.replace(`/medicines?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams]
  );

  return (
    <div className="search-wrap">
      <span className="search-icon" aria-hidden="true">🔍</span>
      <input
        id="medicine-search-input"
        type="search"
        className="search-input"
        placeholder={placeholder}
        defaultValue={initialQuery}
        onChange={handleChange}
        aria-label="Search medicines"
        autoComplete="off"
        data-pending={isPending ? "true" : undefined}
      />
    </div>
  );
}
