import { shade } from './color';

export const hex2Rgb = (hex: string) => {
  let colorSections = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (colorSections == null) {
    return { red: 0, green: 0, blue: 0};
  }

  const red = parseInt(colorSections[1], 16);
  const green = parseInt(colorSections[2], 16);
  const blue = parseInt(colorSections[3], 16);
  return { red, green, blue };
};

export const determineFontColor = (color: string, override = false, darkColor = shade(100), lightColor = shade(0)) => {
  let {red, green, blue} = hex2Rgb(color);
  let check = 1 - (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  if (override) {
    return (check < 0.5)
      ? lightColor
      : darkColor;
  } else {
    return (check < 0.5)
      ? darkColor
      : lightColor;
  }
};

export const capitalize = (word: string) => (word[0].toUpperCase() + word.slice(1));

export const capitalizeAll = (word: string) => {
  let words = word.split(' ');
  let capitalizedWords = words.map(singleWord => (
    capitalize(singleWord)
  ));
  return capitalizedWords.join(' ');
};

export const beautifyNumber = (num: number, accuracy = 0) => {
  let numToFormat = num.toFixed(accuracy);
  let numParts = numToFormat.split('.');
  let [dollarAmount] = numParts;
  numParts[0] = dollarAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return numParts.join('.');
};
