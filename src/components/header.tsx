'use client';

import SignOutButton from "@/app/s/[sheetId]/sign-out";
import { House } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
  sheetName: string;
}

export default function Header({ sheetName: initialSheetName }: HeaderProps) {
  const [sheetName, setSheetName] = useState(initialSheetName);

  return (
    <header className="sticky top-0 left-0 border-b px-6 py-3 flex items-center justify-between bg-gray-600">
      <h1 className="text-2xl font-bold">
        <input
          id="sheetName"
          name="sheetName"
          type="text"
          value={sheetName}
          onChange={(e) => setSheetName(e.target.value)}
          className="text-white bg-gray-600 border border-transparent hover:border-white cursor-default hover:cursor-pointer focus:cursor-text rounded px-2 py-1"
        />
      </h1>
      <div className="flex items-center gap-4">
        <SignOutButton />
        <Link href="/">
          <House className="w-6 h-6 text-white" />
        </Link>
        <div className="bg-pink-200 rounded-full w-7 aspect-square" />
      </div>
    </header>
  )
}