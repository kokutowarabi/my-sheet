// @/app/page.tsx

import Link from "next/link";

export default async function Home() {
  return (
    <>
      <main
        className="flex justify-center items-center flex-col gap-10 min-h-[100svh] bg-gray-100"
      >
        <h1 className='flex flex-col items-center gap-4'>
          <span className="text-6xl">Welcome to</span>
          <span className="text-9xl font-black">My Sheet</span>
        </h1>
        <Link href="/sign-in" className="p-5 rounded-full text-white text-xl bg-blue-500 hover:bg-blue-600 transition">Sign In</Link>
      </main>
    </>
  );
}
