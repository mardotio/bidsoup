import { limitNumberToRange } from './utils';

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export class Color {
  private color: string[];

  static shade = (percent: number) => (
    new Color(`#${Math.round((100 - percent) * 255 / 100).toString(16).repeat(3)}`)
  )

  static stripPound = (hex: string) => hex.replace('#', '');

  static isValidShorthandHex = (hex: string) => {
    let stripped = Color.stripPound(hex);
    let split = stripped.match(/[a-f0-9]/gi) || [];
    return stripped.length === 3 && split.length === 3;
  }

  static isValidHex = (hex: string) => {
    let stripped = Color.stripPound(hex);
    let split = Color.stripPound(hex).match(/[a-f0-9]/gi) || [];
    return stripped.length === 6 && split.length === 6;
  }

  static validateHexColor = (hex: string) => (Color.isValidHex(hex) || Color.isValidShorthandHex(hex));

  constructor(c: string) {
    this.hex = c;
  }

  get hex() {
    if (this.color.every(c => c[0] === c[1])) {
      return this.color.reduce((color, c) => (color + c[0]), '#');
    }
    return this.color.reduce((color, c) => (color + c), '#');
  }

  set hex(c: string) {
    if (Color.isValidShorthandHex(c)) {
      this.color = this.splitByColor(this.expandHex(Color.stripPound(c)));
    } else if (Color.isValidHex(c)) {
      this.color = this.splitByColor(Color.stripPound(c));
    } else {
      throw Error(`${c} is not a valid color`);
    }
  }

  get rgb(): RgbColor {
    let [r, g, b] = this.color;
    return {
      r: this.hex2Dec(r),
      g: this.hex2Dec(g),
      b: this.hex2Dec(b)
    };
  }

  lighten = (percent: number) => (this.adjustColor(percent));

  darken = (percent: number) => (this.adjustColor(-1 * percent));

  private hex2Dec = (hex: string) => (Number(parseInt(hex, 16).toString(10)));

  private dec2Hex = (dec: number, length = 0) => {
    let hex = dec.toString(16);
    if (hex.length < length) {
      return '0'.repeat(length - hex.length) + dec.toString(16);
    }
    return hex;
  }

  private expandHex = (hex: string) => (
    hex.split('').reduce((e, c) => (e + c + c), '')
  )

  private splitByColor = (hex: string) => (
    this.color = hex.match(/[a-f0-9]{2}/gi) || []
  )

  private adjustColor = (percent: number) => {
    let rgb = this.rgb;
    let newRgb = ['r', 'g', 'b'].map(c => {
      return this.dec2Hex(limitNumberToRange(Math.round(255 * percent) + rgb[c], 0, 255), 2);
    });
    return newRgb.reduce((color, c) => (color + c), '#');
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
