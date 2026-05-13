import { buildMetadata } from '@/lib/seo/metadata';
import { ShieldCheck, Target, Users, Zap, Award, Microscope, FlaskConical } from 'lucide-react';
import Link from 'next/link';

export const metadata = buildMetadata({
  title: 'About Our Mission',
  description: 'How ProAthletica uses the Athletica Lab protocol: 47,000+ review data points, spec verification, and editorial oversight to rank fitness gear.',
  canonical: '/about',
});

const EDITORS = [
  {
    name: 'Alex Rivera',
    role: 'Editorial Director',
    bio: 'Former competitive powerlifter and CSCS with 12+ years of experience in gear testing.',
    img: 'AR'
  },
  {
    name: 'Jordan Kim',
    role: 'Technical Lead',
    bio: 'Material scientist focused on durability benchmarks and steel gauge verification.',
    img: 'JK'
  },
  {
    name: 'Sam Torres',
    role: 'Testing Lead',
    bio: 'Marathoner and CrossFit coach specializing in cardio equipment and small-space setups.',
    img: 'ST'
  }
];

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-5xl space-y-24 px-4 py-20 sm:px-8">
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
            <div key={editor.name} className="space-y-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-card bg-gradient-to-br from-graphite-700 to-graphite-900 border border-white/[0.06] text-xl font-black text-offwhite">
                {editor.img}
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black uppercase tracking-tight text-white">{editor.name}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-trust-blue">{editor.role}</p>
              </div>
              <p className="text-sm leading-relaxed text-neutral-500">{editor.bio}</p>
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
