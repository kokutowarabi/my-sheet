export default async function Loading() {
  return (
    <main className="flex flex-col justify-start min-h-[100svh] max-h-[100svh] px-10 pb-10">
      <div className="flex gap-10 items-center justify-start w-full pt-20 pb-8 px-10">
        <div className="rounded-full w-20 h-20 bg-gray-300 animate-pulse" />
        <span className="min-w-[144px] min-h-[40px] bg-gray-300 animate-pulse" />
      </div>
      <div className="flex flex-col gap-10 items-start py-10 px-10 w-full h-[80svh] overflow-y-auto hover:bg-gray-100 rounded-md hidden-scrollbar transition">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="min-h-[80px] w-full rounded-md bg-gray-300 animate-pulse shadow-md" />
        ))}
      </div>
    </main>
  )
}