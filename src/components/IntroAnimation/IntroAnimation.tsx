// ============================================================
// LAVSA — Intro Animation Component
// LAVSA zooms in, holds, then ZOOMS FULLY to fill entire screen
// before the sign-in page appears. Once per browser session.
// ============================================================

import React, { useEffect, useState } from 'react';
import { APP_NAME, INTRO_SHOWN_KEY } from '../../config/appConfig';

interface IntroAnimationProps {
  onComplete?: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'idle' | 'zoom' | 'hold' | 'burst' | 'done'>('idle');
  const [done, setDone] = useState<boolean>(() => {
    return sessionStorage.getItem(INTRO_SHOWN_KEY) === 'true';
  });

  useEffect(() => {
    if (done) return;

    const t1 = setTimeout(() => setPhase('zoom'),  50);    // tiny → normal
    const t2 = setTimeout(() => setPhase('hold'),  750);   // normal → hold
    const t3 = setTimeout(() => setPhase('burst'), 1600);  // hold → FULL SCREEN BURST
    const t4 = setTimeout(() => {
      sessionStorage.setItem(INTRO_SHOWN_KEY, 'true');
      setDone(true);
      onComplete?.();
    }, 2250);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [done, onComplete]);

  if (done) return null;

  // ── Scale values ──────────────────────────────────────────
  // At 72px font, "LAVSA" is ~340px wide.
  // To fill a 1920px wide screen: 1920/340 ≈ 56.
  // We go with 60 to guarantee overflow on all screens.
  const scaleMap = {
    idle:  'scale(0.12)',
    zoom:  'scale(1)',
    hold:  'scale(1)',
    burst: 'scale(60)',
    done:  'scale(1)',
  };

  const opacityMap: Record<string, number> = {
    idle:  0,
    zoom:  1,
    hold:  1,
    burst: 1,   // keep visible — it's the text that fills the screen
    done:  1,
  };

  // Overlay fades out AFTER the burst so it's instant cut to white login
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 10000,
    overflow: 'hidden',               // clip the giant scaled text
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    opacity: phase === 'burst' ? 0 : 1,
    transition: phase === 'burst' ? 'opacity 0.45s ease 0.2s' : 'none',
    pointerEvents: 'all',
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '72px',
    fontWeight: '900',
    letterSpacing: '0.12em',
    fontFamily: "'Inter', system-ui, sans-serif",
    color: '#111827',
    transform: scaleMap[phase] ?? 'scale(1)',
    opacity: opacityMap[phase] ?? 1,
    transition: phase === 'zoom'
      ? 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease'
      : phase === 'burst'
      ? 'transform 0.6s cubic-bezier(0.4, 0, 0.6, 1)'
      : 'none',
    userSelect: 'none',
    willChange: 'transform, opacity',
    whiteSpace: 'nowrap',
  };

  const tagStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(50% + 60px)',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: '12px',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: '#9ca3af',
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: '500',
    opacity: phase === 'zoom' || phase === 'hold' ? 1 : 0,
    transition: phase === 'zoom' ? 'opacity 0.5s ease 0.35s' : 'opacity 0.15s ease',
    pointerEvents: 'none',
  };

  return (
    <div style={overlayStyle}>
      <div style={logoStyle}>{APP_NAME}</div>
      <div style={tagStyle}>Campus Buy &amp; Sell</div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
      `}</style>
    </div>
  );
};

export default IntroAnimation;
