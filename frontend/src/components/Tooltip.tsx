'use client';

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ content, children, position = 'top', delay = 200 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const padding = 8;

    let x = 0;
    let y = 0;

    // Calculate initial position based on preferred position
    switch (position) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - 8;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + 8;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + 8;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    // Collision detection - flip if needed
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Flip vertically if clipping top/bottom
    if (y < padding) {
      // Flip to bottom
      y = triggerRect.bottom + 8;
    } else if (y + tooltipRect.height > viewportHeight - padding) {
      // Flip to top
      y = triggerRect.top - tooltipRect.height - 8;
    }

    // Shift horizontally to stay in viewport
    if (x < padding) {
      x = padding;
    } else if (x + tooltipRect.width > viewportWidth - padding) {
      x = viewportWidth - tooltipRect.width - padding;
    }

    setCoords({ x, y });
  }, [position]);

  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Position update happens after render via useEffect
    }, delay);
  }, [delay]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  // Update position after tooltip becomes visible
  useEffect(() => {
    if (isVisible) {
      // Small delay to ensure tooltip is rendered
      requestAnimationFrame(() => {
        updatePosition();
      });
    }
  }, [isVisible, updatePosition]);

  // Update position on scroll/resize
  useEffect(() => {
    if (!isVisible) return;

    const handleUpdate = () => updatePosition();
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isVisible, updatePosition]);

  const tooltipElement = isVisible && mounted ? (
    <div
      ref={tooltipRef}
      className="fixed z-[9999] px-3 py-2 text-xs text-white bg-zinc-900 dark:bg-zinc-700 rounded-lg shadow-lg max-w-xs pointer-events-none animate-fade-in"
      style={{
        left: coords.x,
        top: coords.y,
      }}
    >
      {content}
      {/* Arrow */}
      <div
        className="absolute w-2 h-2 bg-zinc-900 dark:bg-zinc-700 rotate-45"
        style={{
          ...(position === 'top' && { bottom: -4, left: '50%', transform: 'translateX(-50%) rotate(45deg)' }),
          ...(position === 'bottom' && { top: -4, left: '50%', transform: 'translateX(-50%) rotate(45deg)' }),
          ...(position === 'left' && { right: -4, top: '50%', transform: 'translateY(-50%) rotate(45deg)' }),
          ...(position === 'right' && { left: -4, top: '50%', transform: 'translateY(-50%) rotate(45deg)' }),
        }}
      />
    </div>
  ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      {mounted && tooltipElement && createPortal(tooltipElement, document.body)}
    </>
  );
}

// Metric-specific tooltip content
export const metricTooltips = {
  r2: (
    <div>
      <strong className="block mb-1">R² (Coefficient of Determination)</strong>
      <p>Measures how well the model explains the variance in the data.</p>
      <ul className="mt-1 ml-3 list-disc">
        <li><strong>1.0</strong> = Perfect fit</li>
        <li><strong>0.9+</strong> = Excellent</li>
        <li><strong>0.7-0.9</strong> = Good</li>
        <li><strong>&lt;0.7</strong> = Poor fit</li>
      </ul>
    </div>
  ),
  rmse: (
    <div>
      <strong className="block mb-1">RMSE (Root Mean Square Error)</strong>
      <p>Average magnitude of prediction errors, in the same units as y.</p>
      <ul className="mt-1 ml-3 list-disc">
        <li>Lower is better</li>
        <li>Penalizes large errors more heavily</li>
        <li>Compare to the scale of your y values</li>
      </ul>
    </div>
  ),
  mae: (
    <div>
      <strong className="block mb-1">MAE (Mean Absolute Error)</strong>
      <p>Average absolute difference between predicted and actual values.</p>
      <ul className="mt-1 ml-3 list-disc">
        <li>Lower is better</li>
        <li>More robust to outliers than RMSE</li>
        <li>Easier to interpret directly</li>
      </ul>
    </div>
  ),
};

export default Tooltip;
