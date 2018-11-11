import { limitNumberToRange } from './utils';

// Returns hex color code based on concentration of black
// Expects a number from 0-100 (percent of black)
export const shade = (percent: number) => (
  `#${Math.round((100 - percent) * 255 / 100).toString(16).repeat(3)}`
);

export class Color {
  hex: string;
  decimal: number[];

  static hexToDecimal = (hex: string) => (
    (hex.match(/[a-f0-9]{2}/gi) || []).map(c => (
      Number(parseInt(c, 16).toString(10))
    ))
  )

  static shade = (percent: number) => (
    new Color(`#${Math.round((100 - percent) * 255 / 100).toString(16).repeat(3)}`)
  )

  constructor(c: string) {
    this.hex = c;
    this.decimal = Color.hexToDecimal(this.hex);
  }

  lighten = (percent: number) => (this.adjustColor(percent));

  darken = (percent: number) => (this.adjustColor(-1 * percent));

  private hexWithPadding = (hex: string) => ( hex.length < 2 ? `0${hex}` : hex);

  private adjustColor = (percent: number) => {
    let newRGB = this.decimal.map(c => {
      let newHex = limitNumberToRange(Math.round(255 * percent) + c, 0, 255).toString(16);
      return this.hexWithPadding(newHex);
    });
    return newRGB.reduce((built, c) => `${built}${c}`, '#');
  }
}

export const theme = {
  fill: new Color('#f3f6f9'),
  background: Color.shade(0),
  primary: new Color('#4a2aea'),
  secondary: new Color('#842aea'),
  accent: new Color('#1180f7'),
  error: new Color('#ff1744'),
  success: '',
  text: {
    dark: Color.shade(87),
    medium: Color.shade(60),
    light: Color.shade(38)
  },
  components: {
    border: Color.shade(8),
    scrollbar: Color.shade(13),
    darkBorder: Color.shade(42)
  },
  interactions: {
    hover: Color.shade(8)
  }
};

export const categoryColors = {
  color_1: `#b2135d`,
  color_2: `#704bc6`,
  color_3: `#24af63`,
  color_4: `#ce5056`,
  color_5: `#516077`
};
