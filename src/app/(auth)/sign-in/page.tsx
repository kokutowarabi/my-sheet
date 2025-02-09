// @/app/(auth)/sign-in/page.tsx
import Aiueo from "./components/aiueo";
import GoogleSignInButton from "./components/google-sign-in-button";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">ログイン</h1>
      <GoogleSignInButton />
      <Aiueo />
    </main>
  );
}