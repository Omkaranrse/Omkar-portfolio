'use client';

import * as React from 'react';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface BackButtonProps {
  fallbackHref?: string;
  label?: string;
  className?: string;
}

export function useSmartBack(fallbackHref: string = '/#contact') {
  const router = useRouter();

  const handleBack = useCallback(() => {
    try {
      if (
        typeof window !== 'undefined' &&
        window.history.length > 1 &&
        document.referrer &&
        new URL(document.referrer).origin === window.location.origin
      ) {
        router.back();
      } else {
        router.push(fallbackHref);
      }
    } catch {
      router.push(fallbackHref);
    }
  }, [router, fallbackHref]);

  return handleBack;
}

export default function BackButton({
  fallbackHref = '/#contact',
  label = 'Back',
  className = '',
}: BackButtonProps) {
  const smartBack = useSmartBack(fallbackHref);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    e.preventDefault();
    smartBack();
  };

  return (
    <a
      href={fallbackHref}
      onClick={handleClick}
      className={`site-back-pill-btn ${className}`.trim()}
      aria-label="Go back"
    >
      <svg
        className="back-pill-arrow"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span>{label}</span>
    </a>
  );
}
