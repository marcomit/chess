'use client'

import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function Page() {
  return <h1>Prrrr
    <Button onClick={() => toast("rerer")}>Ciao</Button>
  </h1>
}