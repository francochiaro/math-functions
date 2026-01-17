export interface Point {
  x: number;
  y: number;
  id?: string;
}

export interface ChartBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface FittedCurve {
  points: Point[];
  expression: string;
  color: string;
}

export type FittingObjective = 'accuracy' | 'interpretability' | 'balanced';

export interface FitStatistics {
  r2: number;
  rmse: number;
  mae: number;
  aic?: number;
  bic?: number;
}

export type FitQuality = 'bad' | 'regular' | 'good';

export interface FitResult {
  expression: string;
  expressionLatex: string;
  statistics: FitStatistics;
  quality: FitQuality;
  curvePoints: Point[];
  modelType: string;
}

export interface AnalyticalProperties {
  firstDerivative: string;
  secondDerivative: string;
  extrema: {
    type: 'maximum' | 'minimum';
    x: number;
    y: number;
  }[];
  asymptotes: {
    type: 'vertical' | 'horizontal' | 'oblique';
    value: number | string;
  }[];
}

export interface IntegralResult {
  pointA: Point;
  pointB: Point;
  area: number;
  expression: string;
}
