'use client';

import { useState, useEffect } from 'react';
import { Newsletter } from './Newsletter';
import { X } from 'lucide-react';

export function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Only show if not shown before in this session
    const shown = sessionStorage.getItem('exit_intent_shown');
    if (shown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem('exit_intent_shown', 'true');
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    // Fallback for mobile devices (show after 45 seconds)
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem('exit_intent_shown', 'true');
      }
    }, 45000);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timer);
    };
  }, [hasShown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] hidden md:flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl overflow-hidden rounded-card border border-white/10 bg-graphite-900 shadow-2xl">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 text-neutral-500 hover:text-white transition-colors p-2"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          <Newsletter source="exit-intent" />
        </div>
      </div>
    </div>
  );
}
