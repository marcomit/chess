import { events } from "@/config/socket-events";
import { UuidSchema } from "@/types/zod-types";
import type { Socket } from "socket.io";
import type { z, ZodType } from "zod";


const onSocketServer = <
  TChannel extends keyof typeof events,
  TEvent extends keyof (typeof events)[TChannel],
  TData extends (typeof events)[TChannel][TEvent],
>(
  socket: Socket,
  channel: TChannel,
  event: TEvent extends string ? TEvent : never,
  data: (
    data: z.infer<TData extends ZodType ? TData : never> & {
      other?: any;
    },
  ) => void,
) => {
  socket.on(toSocketKey("server", channel, event), data);
};
const emitSocketServer = <
  TChannel extends keyof typeof events,
  TEvent extends keyof (typeof events)[TChannel],
  TData extends (typeof events)[TChannel][TEvent],
>(
  socket: Socket,
  channel: TChannel,
  event: TEvent extends string ? TEvent : never,
  data: z.infer<TData extends ZodType ? TData : never> & { other?: any },
  to?: UuidSchema,
) => {
  if (to) socket.to(to).emit(toSocketKey("client", channel, event), data);
  else socket.broadcast.emit(toSocketKey("client", channel, event), data);
};

const socketServerEvent = <
  TChannel extends keyof typeof events,
  TEvent extends keyof (typeof events)[TChannel],
>(
  socket: Socket,
  channel: TChannel,
  event: TEvent extends string ? TEvent : never,
  to?: UuidSchema,
) => {
  onSocketServer(socket, channel, event, (receivedData) =>
    emitSocketServer(socket, channel, event, receivedData, to),
  );
};

function toSocketKey<
  TChannel extends keyof typeof events,
  TEvent extends keyof (typeof events)[TChannel],
>(
  side: "server" | "client",
  channel: TChannel,
  event: TEvent extends string ? TEvent : never,
): string {
  return `${channel}__${side === "client"
    ? event
    : "on" + event.at(0)?.toUpperCase() + event.substring(1).toLowerCase()
    }`;
}

export { onSocketServer, emitSocketServer, socketServerEvent };
