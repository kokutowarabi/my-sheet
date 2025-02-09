'use client'

import { SessionProvider } from "next-auth/react";
import DebugSession from "../components/debug-session";

export default function Aiueo() {
  return (
    <SessionProvider>
      <DebugSession />
    </SessionProvider>
  )
}