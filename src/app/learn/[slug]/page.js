import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { GUIDE_CONTENT } from "./guideContent";
import DhanReferralBanner from "@/components/DhanReferralBanner";

export function generateStaticParams() {
  return Object.keys(GUIDE_CONTENT).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = GUIDE_CONTENT[slug];
  if (!guide) return { title: "Guide Not Found" };
  return {
    title: `${guide.title} | OptionsGyani`,
    description: guide.meta,
  };
}

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const guide = GUIDE_CONTENT[slug];

  if (!guide) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <main className="pt-24 px-4 text-center">
          <h1 className="text-3xl font-bold text-white">Guide Not Found</h1>
          <Link href="/learn" className="text-blue-400 mt-4 inline-block">← Back to guides</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <main className="pt-20 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
        <Link href="/learn" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to all guides
        </Link>

        <article className="max-w-none">
          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-12 leading-tight tracking-tight">
             {guide.title}
          </h1>

          {guide.sections.map((section, i) => (
            <section key={i} className="mb-14">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
                 <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">{i+1}</span>
                 {section.heading}
              </h2>
              {/* Using dangerouslySetInnerHTML to allow our massive dense HTML blocks */}
              <div 
                 className="prose prose-invert prose-lg max-w-none prose-emerald prose-headings:text-white prose-a:text-blue-400 prose-strong:text-white"
                 dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </section>
          ))}
        </article>

        {/* CTA */}
        <div className="glass-card rounded-2xl p-8 mt-12 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Ready to practice?</h3>
          <p className="text-slate-400 mb-6">Try this strategy in our Strategy Builder or Paper Trading simulator — no real money required.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/builder" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-600 text-white font-semibold hover:from-blue-500 hover:to-blue-500 transition-all">
              Open Strategy Builder
            </Link>
            <Link href="/paper-trade" className="px-6 py-3 rounded-xl glass text-white font-semibold hover:bg-white/5 transition-all">
              Try Paper Trading
            </Link>
          </div>
        </div>

        {/* Dhan referral — bottom of every lesson */}
        <div className="mt-8">
          <DhanReferralBanner variant="card" context="learn" />
        </div>
      </main>
    </div>
  );
}
