"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { socket } from "@/lib/socket";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    socket.on('game', 'search', (data) => {

    })
    return () => {
      socket.off('game', 'search')
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
