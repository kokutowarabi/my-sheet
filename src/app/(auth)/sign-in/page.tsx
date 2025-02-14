// @/app/(auth)/sign-in/page.tsx
import Redirect from "@/lib/redirect";
import GoogleSignInButton from "./components/google-sign-in-button";

export default async function LoginPage() {
  await Redirect();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">ログイン</h1>
      <GoogleSignInButton />
      {/* <Aiueo /> */}
    </main>
  );
}