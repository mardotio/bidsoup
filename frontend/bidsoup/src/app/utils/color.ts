// Returns hex color code based on concentartion of black
// Expects a number from 0-100 (percent of black)
export const shade = (percent: number) => (
  `#${Math.round((100 - percent) * 255 / 100).toString(16).repeat(3)}`
);

export const textColor = {
  dark: shade(87),
  medium: shade(60),
  light: shade(38)
};

export const theme = {
  background: '#f3f6f9',
  primary: '#4a2aea',
  secondary: '#842aea',
  accent: '#1180f7',
  error: '#ff1744'
};

export const interactions = {
  hover: shade(8)
};

export const components = {
  border: shade(8),
  scrollbar: shade(13),
  darkBorder: shade(42)
};

export const categoryColors = {
  color_1: `#b2135d`,
  color_2: `#704bc6`,
  color_3: `#24af63`,
  color_4: `#ce5056`,
  color_5: `#516077`
};
