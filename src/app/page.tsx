import Link from "next/link";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-4xl sm:text-5xl font-semibold tracking-tight">
          nertia
        </div>

        {/* Navigation */}
        <nav className="flex gap-4 text-sm">
          <Link href="/work" className="hover:underline">Work</Link>
          <Link href="/battlezone" className="hover:underline">Battlezone</Link>
          <a href="/Scott_Campbell_Resume_ATS.txt" className="hover:underline">Resume</a>
        </nav>
      </main>
    </div>
  );
}
