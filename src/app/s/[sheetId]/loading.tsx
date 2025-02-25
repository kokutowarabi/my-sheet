// @/app/s/[sheetId]/loading.tsx

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link";
import SignOutButton from "./sign-out";
import { House } from "lucide-react";
import { CELL_HEIGHT, CELL_WIDTH, CORNER_SIDE } from "@/lib/constants";

const HEADER_HEIGHT = 67;
const TOOLBAR_HEIGHT = 0;

export default function Loading() {
  return (
    <>
      <header className="sticky top-0 left-0 border-b px-6 py-3 flex items-center justify-between bg-gray-600 h-[67px]">
        <h1 className="text-2xl font-bold">
          <div
            id="sheetName"
            className='text-white bg-gray-500 border border-transparent rounded w-[296px] h-[42px] animate-pulse cursor-default'
          />
        </h1>
        <div className="flex items-center gap-4">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger>
                <SignOutButton />
              </TooltipTrigger>
              <TooltipContent>
                <p>サインアウト</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger>
                <Link href="/">
                  <House className="w-6 h-6 text-white" />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>ホーム画面に戻る</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="bg-pink-200 rounded-full w-7 aspect-square" />
        </div>
      </header>
      <main>
        <div
          style={{
            gridTemplate: `${CORNER_SIDE}px 1fr / ${CELL_WIDTH}px 1fr`,
            maxHeight: `calc(100svh - (${HEADER_HEIGHT}px + ${TOOLBAR_HEIGHT}px))`,
          }}
          className="grid overflow-auto max-w-screen hidden-scrollbar"
        >
          <div style={{ minWidth: `${CELL_WIDTH}px`, minHeight: `${CORNER_SIDE}px` }} className="sticky top-0 left-0 z-corner-cell bg-gray-100 border-r border-b border-t border-l border-gray-400/80" />
          <div className="flex max-h-fit sticky top-0 left-0 z-column-headers">
            {Array.from({ length: 9 }).map((_, i) => (
              <div style={{ minWidth: `${CELL_WIDTH}px`, minHeight: `${CORNER_SIDE}px` }} key={i} className="bg-gray-100 border-t border-r border-b border-gray-400/80 flex items-center justify-center">
                <div className="animate-pulse w-28 h-5 rounded-md bg-gray-300" />
              </div>
            ))}
          </div>
          <div className="sticky left-0 z-row-headers">
            {Array.from({ length: 12 }).map((_, i) => (
              <div style={{ minWidth: `${CELL_WIDTH}px`, minHeight: `${CELL_HEIGHT}px` }} key={i} className="bg-gray-100 border-r border-b border-l border-gray-400/80 flex items-center justify-center">
                <div className="animate-pulse w-28 h-5 rounded-md bg-gray-300" />
              </div>
            ))}
          </div>
          <div
            style={{
              gridTemplateColumns: `repeat(9, ${CELL_WIDTH}px)`,
              gridTemplateRows: `repeat(12, ${CELL_HEIGHT}px)`,
            }}
            className="grid z-body-cells relative">
            {Array.from({ length: 9 * 12 }).map((_, i) => (
              <div style={{ minWidth: `${CELL_WIDTH}px`, minHeight: `${CELL_HEIGHT}px` }} key={i} className="border-gray-300 border-r border-b flex items-center justify-center">
                <div className="animate-pulse w-28 h-5 rounded-md bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}