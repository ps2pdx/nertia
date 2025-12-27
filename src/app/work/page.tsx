import Link from "next/link";

export default function Work() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-4xl sm:text-5xl font-semibold tracking-tight">
          nertia
        </div>
        <nav className="flex gap-4 text-sm">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/battlezone" className="hover:underline">Battlezone</Link>
          <a href="/Scott_Campbell_Resume_ATS.txt" className="hover:underline">Resume</a>
        </nav>
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            <a
              href="https://vantagecompute.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              vantagecompute.ai
            </a>
          </li>
          <li className="mb-2 tracking-[-.01em]">
            <a
              href="https://lillard.nertia.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              lillard.nertia.ai
            </a>
          </li>
          <li className="mb-2 tracking-[-.01em]">
            <a
              href="https://alisharifirugs.net"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              alisharifirugs.net
            </a>
          </li>
          <li className="mb-2 tracking-[-.01em]">
            <a
              href="https://purps.world"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              purps.world
            </a>
          </li>
          <li className="mb-2 tracking-[-.01em]">
            <a
              href="https://kalcontracting.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              kalcontracting.com
            </a>
          </li>
          <li className="mb-2 tracking-[-.01em]">
            <a
              href="https://equisearchrecruiting.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              equisearchrecruiting.com
            </a>
          </li>
          <li className="tracking-[-.01em]">
            <a
              href="https://super35.media"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              super35.media
            </a>
          </li>
        </ol>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://instagram.com/scottysup"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn.simpleicons.org/instagram/000000"
            alt="Instagram"
            width="16"
            height="16"
            className="dark:invert"
          />
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://x.com/ps2pdx"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn.simpleicons.org/x/000000"
            alt="X"
            width="16"
            height="16"
            className="dark:invert"
          />
        </a>
      </footer>
    </div>
  );
}

