import type { events } from "@/config/socket-events";
import { io } from "socket.io-client";
import type { z, ZodType } from "zod";


const socket = io("http://localhost:8080");
const onSocket = <
  TChannel extends keyof typeof events,
  TEvent extends keyof (typeof events)[TChannel],
  TData extends (typeof events)[TChannel][TEvent]
>(
  channel: TChannel,
  event: TEvent extends string ? TEvent : never,
  data: (
    data: z.infer<TData extends ZodType ? TData : never> & {
      other?: any;
    }
  ) => void
) => {
  socket.on(toSocketKey("client", channel, event), data);
};
const emitSocket = <
  TChannel extends keyof typeof events,
  TEvent extends keyof (typeof events)[TChannel],
  TData extends (typeof events)[TChannel][TEvent]
>(
  channel: TChannel,
  event: TEvent extends string ? TEvent : never,
  data: z.infer<TData extends ZodType ? TData : never> & { other?: any }
) => {
  socket.emit(toSocketKey("server", channel, event), data);
};
const offSocket = <
  TChannel extends keyof typeof events,
  TEvent extends keyof (typeof events)[TChannel]
>(
  channel: TChannel,
  event: TEvent extends string ? TEvent : never
) => {
  socket.off(toSocketKey("client", channel, event));
};

function toSocketKey<
  TChannel extends keyof typeof events,
  TEvent extends keyof (typeof events)[TChannel]
>(
  side: "server" | "client",
  channel: TChannel,
  event: TEvent extends string ? TEvent : never
): string {
  return `${channel}__${
    side === "client"
      ? event
      : "on" + event.at(0)?.toUpperCase() + event.substring(1).toLowerCase()
  }`;
}

export const handleSocket = {
  on: onSocket,
  emit: emitSocket,
  off: offSocket,
  toSocketKey,
};
