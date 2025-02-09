// @/app/(auth)/sign-in/components/google-sign-in-button.tsx
'use client'

import { signIn } from "next-auth/react";

export default function GoogleSignInButton() {
  const handleGoogleSignIn = () => {
    // NextAuth の "google" プロバイダーを指定してサインインを実行
    signIn("google");
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
    >
      Googleでログイン
    </button>
  );
}
