'use client';

import SignOutButton from "@/app/s/[sheetId]/sign-out";
import { useState } from "react";

interface HeaderProps {
  sheetName: string;
}

export default function Header({ sheetName: initialSheetName }: HeaderProps) {
  const [sheetName, setSheetName] = useState(initialSheetName);

  return (
    <header className="sticky top-0 left-0 border-b px-4 py-3 flex items-center justify-between">
      <div className="border rounded-md w-10 aspect-square mr-4" />
      <h1 className="text-2xl font-bold mr-auto">
        <input type="text" value={sheetName} onChange={(e) => setSheetName(e.target.value)} />
      </h1>
      <SignOutButton />
      <div className="bg-gray-100 rounded-full w-7 aspect-square" />
    </header>
  )
}