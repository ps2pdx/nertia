import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-4xl sm:text-5xl font-semibold tracking-tight">
          nertia
        </div>

        {/* Recent Work Section */}
        <section className="w-full max-w-xl flex flex-col gap-4 mt-2">
          <div className="text-lg font-medium mb-1">Recent Work</div>
          <div className="flex flex-col gap-2">
            <a
              href="https://lillard.nertia.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] bg-background/80 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors px-5 py-3 flex flex-col sm:flex-row items-center gap-2 text-base font-medium shadow-sm"
            >
              <span className="text-foreground">lillard.nertia.ai</span>
              <span className="text-xs text-gray-500">NBA stats & visualization</span>
            </a>
            <a
              href="https://purps.world"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] bg-background/80 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors px-5 py-3 flex flex-col sm:flex-row items-center gap-2 text-base font-medium shadow-sm"
            >
              <span className="text-foreground">purps.world</span>
              <span className="text-xs text-gray-500">Community, culture, and creative platform</span>
            </a>
          </div>
        </section>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-6">
          <form
            className="w-full sm:w-auto flex flex-col gap-2"
            method="post"
            encType="text/plain"
            action={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@nertia.ai"}`}
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Your email"
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] bg-transparent px-4 h-10 sm:h-12 text-sm sm:text-base w-full sm:w-56 focus:outline-none"
            />
            <input
              type="text"
              name="message"
              placeholder="Tell us about your project"
              className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] bg-transparent px-4 h-10 sm:h-12 text-sm sm:text-base w-full sm:w-72 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Send
            </button>
          </form>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto"
            href="/work"
          >
            Work
          </a>
        </div>
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
