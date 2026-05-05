import Link from 'next/link';
import { BrandWordmark } from '@/components/Brand';
import { footerLinks } from '@/lib/navigation';

export default function Footer() {
    return (
        <footer className="ds-foot-global">
            <div className="ds-foot-global__col">
                <BrandWordmark size={20} />
                <span className="t-mono fg-quiet">v1 · 2026 · PORTLAND, OR</span>
                <span className="ds-foot-global__tag">FRAMEWORKS FOR PROPULSION.</span>
            </div>

            <div className="ds-foot-global__col">
                <span className="t-eyebrow">LINKS</span>
                <nav aria-label="Footer">
                    {footerLinks.map((l) => (
                        <Link key={l.id} href={l.href} className="ds-foot-global__link">
                            {l.label}
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="ds-foot-global__col">
                <span className="t-eyebrow">CONNECT</span>
                <a href="mailto:ps2pdx@gmail.com" className="ds-foot-global__link">ps2pdx@gmail.com</a>
                <a
                    href="https://linkedin.com/in/scottsuper"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ds-foot-global__link"
                >
                    LinkedIn ↗
                </a>
                <a
                    href="https://github.com/ps2pdx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ds-foot-global__link"
                >
                    GitHub ↗
                </a>
                <span className="t-mono fg-quiet ds-foot-global__rec">FT · contract · consult</span>
            </div>

            <div className="ds-foot-global__bar">
                <span className="t-mono fg-quiet">© 2026 Scott Campbell · n.[ertia]</span>
                <Link href="/design-system" className="t-mono ds-foot-global__bar-link">
                    DESIGN SYSTEM ↗
                </Link>
            </div>
        </footer>
    );
}
