"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [showWork, setShowWork] = useState(false);

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen p-8 pb-20 sm:p-20">
      {/* Center content */}
      <div className="flex flex-col gap-[32px] items-center text-center">
        <div className="text-4xl sm:text-5xl font-semibold tracking-tight">
          nertia.ai
        </div>

        {/* Navigation */}
        <nav className="flex gap-4 text-sm">
          <button onClick={() => setShowWork(!showWork)} className="hover:underline">
            Work
          </button>
          <Link href="/battlezone" className="text-green-500 hover:underline">Battlezone</Link>
          <Link href="/resume" className="hover:underline">Resume</Link>
        </nav>

        {/* Work List with drawer animation */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showWork ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <ol className="list-inside list-decimal text-sm/6 text-center whitespace-nowrap">
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
        </div>
      </div>
    </div>
  );
}
