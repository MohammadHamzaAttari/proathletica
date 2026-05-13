import { buildMetadata } from '@/lib/seo/metadata';
import { personSchema, jsonLdProps } from '@/lib/seo/schema';
import { SITE_URL } from '@/lib/config';
import { ShieldCheck, Target, Users, Zap, Award, Microscope, FlaskConical } from 'lucide-react';
import Link from 'next/link';

export const metadata = buildMetadata({
  title: 'About Our Mission',
  description: 'How ProAthletica uses the Athletica Lab protocol: 47,000+ review data points, spec verification, and editorial oversight to rank fitness gear.',
  canonical: '/about',
});

const EDITORS = [
  {
    id: 'alex-rivera',
    name: 'Alex Rivera',
    role: 'Editorial Director',
    bio: 'Former competitive powerlifter and CSCS with 12+ years of experience in gear testing. Alex oversees the Athletica Score weights.',
    credentials: ['CSCS', 'NSCA-CPT'],
    img: 'AR',
    linkedin: 'https://linkedin.com/in/alex-rivera-proathletica'
  },
  {
    id: 'jordan-kim',
    name: 'Jordan Kim',
    role: 'Technical Lead',
    bio: 'Material scientist focused on durability benchmarks and steel gauge verification. Jordan leads our spec validation lab.',
    credentials: ['Material Science MSc'],
    img: 'JK',
    linkedin: 'https://linkedin.com/in/jordan-kim-proathletica'
  },
  {
    id: 'sam-torres',
    name: 'Sam Torres',
    role: 'Testing Lead',
    bio: 'Marathoner and CrossFit coach specializing in cardio equipment and small-space setups for urban athletes.',
    credentials: ['CrossFit Level 2', 'RRCA Coach'],
    img: 'ST',
    linkedin: 'https://linkedin.com/in/sam-torres-proathletica'
  }
];

export default function AboutPage() {
  const schemas = [
    ...EDITORS.map(e => personSchema({
      name: e.name,
      jobTitle: e.role,
      description: e.bio,
      credentials: (e as any).credentials,
      url: `${SITE_URL}/about#${e.id}`
    }))
  ];

  return (
    <article className="mx-auto max-w-5xl space-y-24 px-4 py-20 sm:px-8">
      <script {...jsonLdProps(schemas)} />
      {/* Hero Section */}
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-trust-blue/20 bg-trust-blue/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-trust-blue">
          <Microscope className="w-3.5 h-3.5" />
          The Data-First Standard
        </div>
        <h1 className="text-5xl sm:text-7xl font-black uppercase italic tracking-tighter text-white leading-none">
          Fitness gear is <br /><span className="text-data-lime">over-marketed.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed text-neutral-400">
          ProAthletica was built to solve a single problem: finding honest, data-backed equipment recommendations without the marketing fluff.
        </p>
      </div>

      {/* Philosophy Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: ShieldCheck, title: 'Independent', desc: 'We do not accept paid placements, sponsored reviews, or "pay-to-play" rankings.' },
          { icon: Target, title: 'Reproducible', desc: 'Our rankings are based on public specs and verified customer sentiment data.' },
          { icon: Award, title: 'Expert-Led', desc: 'Every pick is reviewed by coaches and lifters who understand the training context.' },
        ].map((item) => (
          <div key={item.title} className="rounded-card border border-white/[0.06] bg-graphite-800 p-8 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-trust-blue/10 text-trust-blue">
              <item.icon className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-offwhite">{item.title}</h3>
            <p className="text-sm leading-relaxed text-neutral-500">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* The Protocol */}
      <div className="rounded-card border border-white/[0.06] bg-graphite-800 overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="p-10 lg:p-16 space-y-6">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-data-lime">Our Process</div>
            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white leading-none">The Athletica Lab Protocol</h2>
            <div className="space-y-4 text-neutral-400 text-base leading-relaxed">
              <p>
                We aggregate thousands of verified reviews to find patterns of failure that a 1-week hands-on test might miss. We call this <strong className="text-white">Durability Signaling</strong>.
              </p>
              <p>
                We then verify technical specifications: steel gauges, motor types, fabric weights, and warranty clauses against original manufacturer documents.
              </p>
              <p>
                Finally, our editorial board weighs the data against real-world training needs to assign a final Athletica Score.
              </p>
              <Link href="/methodology" className="inline-flex items-center gap-2 text-sm font-bold text-trust-blue hover:text-white transition-colors">
                Read full methodology →
              </Link>
            </div>
          </div>
          <div className="bg-neutral-900/50 flex items-center justify-center p-10 lg:p-16 border-l border-white/[0.06]">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 text-center p-6 rounded-card bg-white/[0.02] border border-white/[0.04]">
                <div className="text-3xl font-black text-white">47K+</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Reviews Analyzed</div>
              </div>
              <div className="space-y-1 text-center p-6 rounded-card bg-white/[0.02] border border-white/[0.04]">
                <div className="text-3xl font-black text-white">500+</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Products Scored</div>
              </div>
              <div className="space-y-1 text-center p-6 rounded-card bg-white/[0.02] border border-white/[0.04]">
                <div className="text-3xl font-black text-white">100%</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Independent</div>
              </div>
              <div className="space-y-1 text-center p-6 rounded-card bg-white/[0.02] border border-white/[0.04]">
                <div className="text-3xl font-black text-white">2026</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Data Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Board */}
      <div className="space-y-12">
        <div className="space-y-3">
          <h2 className="text-3xl font-black uppercase italic tracking-tight text-white">Editorial Board</h2>
          <p className="text-neutral-500">The expertise behind the Athletica Score.</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {EDITORS.map((editor) => (
            <div key={editor.name} id={editor.id} className="scroll-mt-24 space-y-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-card bg-gradient-to-br from-graphite-700 to-graphite-900 border border-white/[0.06] text-xl font-black text-offwhite">
                {editor.img}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">{editor.name}</h3>
                  {editor.linkedin && (
                    <a href={editor.linkedin} target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-trust-blue transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                  )}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-trust-blue">{editor.role}</p>
              </div>
              <p className="text-sm leading-relaxed text-neutral-500">{editor.bio}</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {editor.credentials.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-neutral-400 uppercase tracking-wider">{c}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="rounded-card border border-white/[0.06] bg-neutral-900/40 p-10 text-center space-y-6">
        <div className="mx-auto max-w-2xl space-y-4">
          <h3 className="text-xl font-black uppercase tracking-tight text-offwhite">Transparency Matters</h3>
          <p className="text-sm leading-relaxed text-neutral-400">
            As an Amazon Associate we earn from qualifying purchases. This commission funds our research but never dictates our results. We recommend the best gear for your training, regardless of affiliate relationships.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
          <Link href="/contact" className="cta-primary w-auto px-8">Get In Touch</Link>
          <Link href="/disclosure" className="text-sm font-bold text-neutral-500 hover:text-white transition-colors">Affiliate Disclosure →</Link>
        </div>
      </div>
    </article>
  );
}
