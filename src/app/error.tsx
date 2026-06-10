"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ErrorState";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("App boundary caught error:", error);
  }, [error]);

  return (
    <ErrorState
      message={error.message || "An unexpected dynamic rendering error occurred."}
      onRetry={reset}
    />
  );
}
