'use client'

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SignOutButton() {

  const handleSignOut = () => {
    signOut();
  };

  return (
    <button
      onClick={handleSignOut}
    >
      <LogOut className="w-6 h-6 text-white" />
    </button>
  );
}
