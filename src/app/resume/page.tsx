import Link from "next/link";

export default function Resume() {
  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 sm:p-20">
      {/* Navigation */}
      <nav className="flex gap-4 text-sm mb-12">
        <Link href="/" className="hover:underline">Home</Link>
        <a href="https://www.battlezone.app" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">Battlezone</a>
        <span className="underline">Resume</span>
      </nav>

      {/* Resume Content */}
      <article className="max-w-3xl w-full space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">SCOTT CAMPBELL</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Portland, OR | <a href="https://linkedin.com/in/scottsuper" target="_blank" rel="noopener noreferrer" className="hover:underline">linkedin.com/in/scottsuper</a> | <a href="https://nertia.ai" className="hover:underline">nertia.ai</a>
          </p>
        </header>

        <section>
          <h2 className="text-lg font-semibold border-b border-current pb-1 mb-3">SUMMARY</h2>
          <p className="text-sm leading-relaxed">
            Technical Product Marketing Manager specializing in AI Infrastructure, Developer Experience, and Brand Strategy. Bridge engineering and GTM teams to translate complex technical capabilities into positioning, messaging, and sales enablement that drives revenue. Background spanning product marketing, brand strategy, business development, and frontend development.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold border-b border-current pb-1 mb-3">EXPERIENCE</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold">Product Marketing Lead</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Vantage Compute | January 2025 - Present</p>
              <p className="text-sm leading-relaxed mb-2">
                Series A HPC cloud provider offering GPU compute for AI/ML, simulation, and life sciences workloads. Retained as strategic consultant following restructuring to oversee platform messaging and web architecture.
              </p>
              <ul className="text-sm leading-relaxed list-disc list-outside ml-5 space-y-2">
                <li><strong>Technical Positioning and GTM Strategy:</strong> Architected core messaging positioning Vantage as the futurecompute layer for AI and HPC. Defined vertical-specific narratives for R&D Simulation, Advanced Manufacturing, and Life Sciences, aligning platform capabilities to buyer pain points. Partnered with engineering to translate Slurm orchestration, NVIDIA GPU lifecycles (H100, A100, L40S), and hybrid cloud architecture into buyer-centric value propositions.</li>
                <li><strong>Executive Advisory:</strong> Acted as strategic advisor to CEO on product roadmap articulation, GTM sequencing, and narrative alignment during Series A fundraising. Served as connective layer between engineering, sales, and leadership to ensure consistent technical, commercial, and brand narratives.</li>
                <li><strong>Sales and Investor Enablement:</strong> Designed technical one-pagers, product overviews, and Figma-based asset libraries for VC pitches, sales demos, and partnership meetings.</li>
                <li><strong>Competitive Intelligence:</strong> Reverse-engineered web stacks, positioning, pricing, and branding of 50+ AI and Neocloud competitors (CoreWeave, Lambda Labs, Together AI) to inform differentiation strategy.</li>
                <li><strong>Website and Brand Systems:</strong> Delivered accelerated site launch in 3 months to support fundraising, followed by ground-up redesign. Developed scalable design system, led Webflow migration, and optimized Core Web Vitals. Created and trademarked VirtuallyLimitless tagline and established brand voice guidelines.</li>
                <li><strong>Content and Creative Production:</strong> Built top-of-funnel content marketing engine (blog, social, newsletter) optimized for SEO/GEO. Created infographics visualizing hybrid compute architectures and custom Lottie animations. Pioneered AI-driven video production using Sora, Claude, and Gemini, reducing production time by 80%.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Founder and Brand Strategist</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Nertia | January 2021 - Present</p>
              <ul className="text-sm leading-relaxed list-disc list-outside ml-5 space-y-2">
                <li><strong>Brand Systems:</strong> Developed Identity in Motion frameworks, moving clients beyond static assets into modular, scalable design systems for digital-first environments.</li>
                <li><strong>Web Architecture:</strong> Designed and developed performance-focused e-commerce platform for TerpScouts. Owned full stack from Figma prototyping to Webflow implementation.</li>
                <li><strong>Strategic Positioning:</strong> Defined tone, voice, and system-based branding philosophies for emerging retail and lifestyle clients.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Founding President</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">SCOUTCAMP | January 2020 - January 2025</p>
              <ul className="text-sm leading-relaxed list-disc list-outside ml-5 space-y-2">
                <li><strong>Product Launch:</strong> Launched Bolts pre-roll brand, owning positioning, go-to-market strategy, and sales channel activation.</li>
                <li><strong>Network Scale:</strong> Established sales and distribution network for TerpScouts and associated brands, driving over $10M in revenue (2020). Led sales team and managed dozens of vendor relationships to streamline supply chain.</li>
                <li><strong>Business Operations:</strong> Owned P&L, CRM, and email automation. Certified Metrc administrator managing compliance and inventory tracking across operations.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Business Development Manager</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">LTRMN | January 2019 - December 2020</p>
              <ul className="text-sm leading-relaxed list-disc list-outside ml-5 space-y-2">
                <li><strong>Market Expansion:</strong> Managed 80+ customer accounts via Zoho CRM, boosting market saturation by over 100% through data-driven territory mapping.</li>
                <li><strong>Sales Enablement:</strong> Produced high-impact visual collateral for internal initiatives and new business ventures.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Account Executive, Enterprise Sales</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">The Sweet Life | October 2017 - December 2018</p>
              <ul className="text-sm leading-relaxed list-disc list-outside ml-5 space-y-2">
                <li><strong>Revenue Growth:</strong> Managed 150+ accounts via CRM, achieving 300% increase in territory revenue through consultative selling.</li>
                <li><strong>Performance:</strong> Ranked highest-grossing account executive in territory by identifying and capitalizing on new vertical opportunities.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">UI/UX Designer and Frontend Developer</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cloud Engage | March 2014 - October 2017</p>
              <ul className="text-sm leading-relaxed list-disc list-outside ml-5 space-y-2">
                <li><strong>Account-Based Marketing:</strong> Built custom demo environments and sales collateral tailored to enterprise target accounts (T-Mobile, Columbia Sportswear), enabling personalized buyer experiences that supported deal progression for localization software platform.</li>
                <li><strong>Product Design:</strong> Partnered with Lead Engineers to overhaul UI/UX of core application and customer-facing chat interfaces.</li>
                <li><strong>Cross-Functional:</strong> Worked with Marketing Director to unify brand identity across WordPress instances and print media.</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold border-b border-current pb-1 mb-3">TECHNICAL SKILLS</h2>
          <div className="text-sm leading-relaxed space-y-2">
            <p><strong>Marketing and Strategy:</strong> GTM Strategy, Product Positioning, SEO/GEO (AI Search), Sales Enablement, Competitive Intelligence, CRM (Zoho), Email Automation</p>
            <p><strong>Infrastructure Fluency:</strong> HPC Concepts, Slurm Workload Manager, NVIDIA GPU Operator, Cloud vs. On-Prem Architecture, Python</p>
            <p><strong>Creative and Tools:</strong> Webflow (CMS and Logic), Figma, Adobe Creative Suite, AI Creative Tools (Sora, Midjourney, Claude), HTML/CSS</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold border-b border-current pb-1 mb-3">EDUCATION</h2>
          <div className="text-sm leading-relaxed space-y-1">
            <p>A.A.S., Web Development and Design - Portland Community College, 2014</p>
            <p>A.A.S. Transfer Degree, Computer Science - Central Oregon Community College, 2012</p>
          </div>
        </section>

        <footer className="text-center pt-8">
          <a 
            href="/Scott_Campbell_Resume_ATS.txt" 
            download
            className="text-sm hover:underline"
          >
            Download TXT Version
          </a>
        </footer>
      </article>
    </div>
  );
}
