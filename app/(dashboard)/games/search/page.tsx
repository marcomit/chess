"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { handleSocket } from "@/lib/socket";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    handleSocket.on('game', 'search', (data) => {

    })
    return () => {
      handleSocket.off('game', 'search')
    }
  }, []);

  return (
    <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  );
}
