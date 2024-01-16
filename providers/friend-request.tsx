'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { socket } from "@/lib/socket"
import { useEffect } from "react"
import { toast } from "sonner"



export const FriendRequestProvider = ({ children }: {
  children: React.ReactNode
}) => {
  useEffect(() => {
    socket.on('friend', 'receive', ({ sender }) => {
      toast(<Card>
        <CardHeader>
          <CardTitle>
            Received a friend request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{sender.name}</p>
        </CardContent>
      </Card>)
    })
  })
  return <>
    {children}
  </>
}