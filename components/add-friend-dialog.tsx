'use client'

import { ChangeEvent, useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"

export const AddFriendDialog = () => {
  const [mounted, setMounted] = useState<boolean>(false)
  const [usersSearched, setUsersSearched] = useState<{ name: string | null, email: string, image: string | null }[]>([])
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    if (name.length < 0) return
    console.log(name)
    const request = await fetch("/api/friends/completion/" + name)
    const users = await request.json()
    console.log(users)
  }

  return <Dialog>
    <DialogTrigger asChild><Button>Add friend</Button></DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add friend</DialogTitle>
      </DialogHeader>
      <Input onChange={handleChange} />
      {mounted && JSON.stringify(usersSearched)}
      <DialogFooter>
        <DialogClose>Cancel</DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
}