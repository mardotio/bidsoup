export const hex2Rgb = hex => {
  let colorSections = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let red = parseInt(colorSections[1], 16);
  let green = parseInt(colorSections[2], 16);
  let blue = parseInt(colorSections[3], 16);
  return ({
    red,
    green,
    blue
  });
};

export const determineFontColor = color => {
  let {red, green, blue} = hex2Rgb(color);
  let check = 1 - (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return (check < 0.5)
    ? 'black'
    : 'white';
};

export const capitalize = word => (word[0].toUpperCase() + word.slice(1));

export const capitalizeAll = word => {
  let words = word.split(' ');
  let capitalizedWords = words.map(singleWord => (
    capitalize(singleWord)
  ));
  return capitalizedWords.join(' ');
};

export const beautifyNumber = (num, accuracy = null) => {
  let numToFormat = accuracy
    ? num.toFixed(accuracy)
    : num;
  let numParts = numToFormat.toString().split('.');
  let [dollarAmount] = numParts; 
  numParts[0] = dollarAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return numParts.join('.');
};
