import { darken, lighten } from './colorManipulation';

export const DEFAULT_COLORS = {
  Hardware: '#4F46E5',
  Software: '#10B981',
  Electronics: '#F59E0B',
  Mechanical: '#EF4444',
  Production: '#8B5CF6',
  Quality: '#EC4899',
  Logistics: '#06B6D4'
};

export const generateColorPalette = (baseColor) => {
  return {
    light: lighten(baseColor, 0.15),
    base: baseColor,
    dark: darken(baseColor, 0.15),
    border: darken(baseColor, 0.1)
  };
};

export const isValidColor = (color) => {
  const s = new Option().style;
  s.color = color;
  return s.color !== '';
};