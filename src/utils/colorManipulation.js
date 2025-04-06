const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

export const lighten = (color, amount) => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  return rgbToHex(
    Math.min(255, rgb.r + (255 - rgb.r) * amount),
    Math.min(255, rgb.g + (255 - rgb.g) * amount),
    Math.min(255, rgb.b + (255 - rgb.b) * amount)
  );
};

export const darken = (color, amount) => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  return rgbToHex(
    Math.max(0, rgb.r * (1 - amount)),
    Math.max(0, rgb.g * (1 - amount)),
    Math.max(0, rgb.b * (1 - amount))
  );
};