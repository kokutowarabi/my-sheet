// app/components/DebugSession.tsx
'use client'

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DebugSession() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // console.log("Client-side session:", session);
    if (status === "authenticated" && session?.user?.sheetId) {
      router.push(`/s/${session.user.sheetId}`);
    }
    // }, [session]);
  }, [status, session, router]);

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
