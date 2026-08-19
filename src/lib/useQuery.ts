"use client";

import { useEffect, useState } from "react";

/** Read query params from window.location (client-only, avoids Suspense
 *  requirements of useSearchParams). Returns a fresh object on each nav. */
export function useQueryParams(): URLSearchParams {
  const [params, setParams] = useState<URLSearchParams>(() =>
    typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search)
  );

  useEffect(() => {
    const onChange = () => setParams(new URLSearchParams(window.location.search));
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);

  return params;
}

/** Run a callback once when the URL contains a given key. */
export function useQueryAction(key: string, onPresent: (value: string) => void) {
  const params = useQueryParams();
  useEffect(() => {
    const v = params.get(key);
    if (v !== null) {
      onPresent(v);
      // clean the URL so re-renders don't re-trigger
      const url = new URL(window.location.href);
      url.searchParams.delete(key);
      window.history.replaceState(null, "", url.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
