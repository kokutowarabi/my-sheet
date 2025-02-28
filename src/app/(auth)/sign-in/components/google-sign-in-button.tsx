'use client'

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function GoogleSignInButton() {
  const handleGoogleSignIn = () => {
    // NextAuth の "google" プロバイダーを指定してサインインを実行
    signIn("google");
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-md hover:shadow-none text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 gap-2 transition"
    >
      <FcGoogle size={28} />
      <span className="text-2xl font-semibold">Googleでログイン</span>
    </button>
  );
}
