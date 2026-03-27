"use client";

import { ConvexProvider as BaseConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useMemo } from "react";

export default function ConvexProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) return null;
    return new ConvexReactClient(url);
  }, []);

  if (!client) {
    if (process.env.NODE_ENV === "development") {
      console.warn("NEXT_PUBLIC_CONVEX_URL is not set — Convex features will not work");
    }
    return <>{children}</>;
  }

  return <BaseConvexProvider client={client}>{children}</BaseConvexProvider>;
}
