// app/components/DebugSession.tsx
'use client'

import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function DebugSession() {
  const { data: session, status } = useSession();

  useEffect(() => {
    console.log("Client-side session:", session);
  }, [session]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Session Debug Info</h2>
      <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap text-sm">
        {JSON.stringify(session, null, 2)}
      </pre>
      <p className="mt-2">Status: {status}</p>
    </div>
  );
}
