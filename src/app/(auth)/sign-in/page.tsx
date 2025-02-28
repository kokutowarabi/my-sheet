import Redirect from "@/lib/redirect";
import GoogleSignInButton from "./components/google-sign-in-button";

export default async function LoginPage() {
  await Redirect();

  return (
    <main className="flex flex-col items-center justify-center min-h-[100svh] bg-gray-100">
      <GoogleSignInButton />
    </main>
  );
}