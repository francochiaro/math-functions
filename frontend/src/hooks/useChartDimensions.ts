'use client';

import { useState, useEffect, useCallback, RefObject } from 'react';
import type { ChartDimensions } from '@/types/chart';

const DEFAULT_MARGIN = {
  top: 40,
  right: 40,
  bottom: 60,
  left: 70,
};

export function useChartDimensions(
  containerRef: RefObject<HTMLDivElement | null>
): ChartDimensions {
  const [dimensions, setDimensions] = useState<ChartDimensions>({
    width: 800,
    height: 600,
    margin: DEFAULT_MARGIN,
  });

  const updateDimensions = useCallback(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({
        width: Math.max(400, width),
        height: Math.max(300, height),
        margin: DEFAULT_MARGIN,
      });
    }
  }, [containerRef]);

  useEffect(() => {
    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [containerRef, updateDimensions]);

  return dimensions;
}
