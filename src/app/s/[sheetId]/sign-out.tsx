'use client'

import { signOut } from "next-auth/react";

export default function SignOutButton() {

  const handleSignOut = () => {
    signOut();
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      サインアウト
    </button>
  );
}
