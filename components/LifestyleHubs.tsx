'use client';

import { Gamepad2, Baby, Dog, Home, Banknote, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HUBS = [
  {
    id: 'gamers',
    label: 'Focus for Gamers',
    icon: Gamepad2,
    desc: 'Posture hacks & under-desk cardio for 8hr+ sessions',
    href: '/category/home-gym',
    color: 'text-purple-400',
    gridArea: 'lg:col-span-1 lg:row-span-1',
    gradient: 'from-purple-500/10 to-transparent',
  },
  {
    id: 'moms',
    label: 'Built for Busy Moms',
    icon: Baby,
    desc: 'Silent gear for nap-time workouts & quick setups',
    href: '/category/resistance-training',
    color: 'text-data-lime',
    gridArea: 'lg:col-span-2 lg:row-span-1',
    gradient: 'from-data-lime/10 to-transparent',
    featured: true,
  },
  {
    id: 'pets',
    label: 'Pet-Owner Approved',
    icon: Dog,
    desc: 'Durable, chew-proof gear for homes with furry helpers',
    href: '/category/home-gym',
    color: 'text-cta-orange',
    gridArea: 'lg:col-span-1 lg:row-span-1',
    gradient: 'from-cta-orange/10 to-transparent',
  },
  {
    id: 'apartment',
    label: 'Small Space Experts',
    icon: Home,
    desc: 'Professional-grade gyms for sub-30 sq ft living',
    href: '/category/home-gym',
    color: 'text-trust-blue',
    gridArea: 'lg:col-span-1 lg:row-span-1',
    gradient: 'from-trust-blue/10 to-transparent',
  },
  {
    id: 'budget',
    label: 'Max Value Builds',
    icon: Banknote,
    desc: 'Data-proven home gym setups under $500 total',
    href: '/category/home-gym',
    color: 'text-savings-green',
    gridArea: 'lg:col-span-3 lg:row-span-1',
    gradient: 'from-savings-green/10 to-transparent',
  },
];

export function LifestyleHubs() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="section-eyebrow mb-1 flex items-center gap-2">
            <Zap className="w-3 h-3" />
            Curated For You
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-offwhite">
            Shop by Lifestyle
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {HUBS.map((hub, index) => (
          <motion.div
            key={hub.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`${hub.gridArea} group`}
          >
            <Link
              href={hub.href}
              className={`relative flex flex-col h-full p-6 rounded-3xl border border-white/5 bg-graphite-900 overflow-hidden transition-all duration-500 hover:border-white/20`}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${hub.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-black/40 border border-white/5 ${hub.color}`}>
                  <hub.icon className="h-6 w-6" />
                </div>

                <h3 className="font-black text-sm text-offwhite uppercase tracking-wider mb-2">
                  {hub.label}
                </h3>

                <p className="text-xs leading-relaxed text-neutral-500 group-hover:text-neutral-300 transition-colors">
                  {hub.desc}
                </p>

                <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-600 group-hover:text-data-lime transition-colors">
                  Explore Hub <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Decorative background element for featured items */}
              {hub.featured && (
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <hub.icon className="w-24 h-24" />
                </div>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
