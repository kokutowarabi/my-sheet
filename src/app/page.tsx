// @/app/page.tsx

import Link from "next/link";

export default async function Home() {
  return (
    <>
      <main
        className="flex justify-center items-center flex-col gap-10 min-h-[100svh] bg-gray-100"
      >
        {/* <Link className="" href={`/u/${userId}`}>
          <span>プロフィール</span>
          <div className="flex gap-2">
            <div className="bg-pink-600 w-6 h-6 rounded-full" />
            <span>{user.userName}</span>
          </div>
        </Link>
        {sheets.map((sheet) => (
          <Link
            key={sheet.id}
            href={`/s/${sheet.id}`}
            className="p-4 border border-gray-400 rounded-md bg-gray-200 hover:bg-gray-400 flex items-center gap-2"
          >
            <div className="bg-pink-600 w-6 h-6 rounded-full" />
            <span>{sheet.sheetName}</span>
          </Link>
        ))} */}
        <h1 className='flex flex-col items-center gap-4'>
          <span className="text-6xl">Welcome to</span>
          <span className="text-9xl font-black">My Sheet</span>
        </h1>
        <Link href="/sign-in" className="p-5 rounded-full text-white text-xl bg-blue-500 hover:bg-blue-600 transition">Sign In</Link>
      </main>
    </>
  );
}
