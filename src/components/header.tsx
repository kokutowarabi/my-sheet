'use client';

import SignOutButton from "@/app/s/[sheetId]/sign-out";
import { House } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import updateSheet from "@/actions/update/update-sheet";
import { handleKeyDown } from "@/lib/keyboard";

interface HeaderProps {
  sheetId: string;
  sheetName: string;
}

export default function Header({ sheetId, sheetName: initialSheetName }: HeaderProps) {
  const [sheetName, setSheetName] = useState(initialSheetName);

  // シート名が変更されたら更新
  const handleBlur = async () => {
    if (sheetName === initialSheetName) return;
    await updateSheet({ sheetId, newValue: sheetName });
  };

  return (
    <header className="sticky top-0 left-0 border-b px-6 py-3 flex items-center gap-6 bg-gray-600">
      <h1 className="text-2xl font-bold flex-grow">
        <input
          id="sheetName"
          name="sheetName"
          type="text"
          value={sheetName}
          onChange={(e) => setSheetName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full text-white bg-gray-600 border border-transparent hover:border-white cursor-default hover:cursor-pointer focus:cursor-text rounded px-2 py-1"
        />
      </h1>
      <div className="flex items-center gap-4">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger>
              <SignOutButton />
            </TooltipTrigger>
            <TooltipContent>
              <p>サインアウトする</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Link href="/">
                <House className="w-6 h-6 text-gray-300 hover:text-white transition" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>トップ画面に戻る</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="bg-pink-200 rounded-full w-7 aspect-square" />
      </div>
    </header>
  );
}
