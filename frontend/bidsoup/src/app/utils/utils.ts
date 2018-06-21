// tslint:disable-next-line:no-any
export const isEmpty = (value: string | any[]) => (
  value.length === 0
);

// tslint:disable-next-line:no-any
export const nestedFind = (arr: Object[], key: string, match: any, nestedKey: string) => {
  let result: Object | null = null;
  arr.find(el => {
    if (el[key] === match) {
      result = el;
    } else if (!isEmpty(el[nestedKey])) {
      result = nestedFind(el[nestedKey], key, match, nestedKey);
    }
    return result != null;
  });
  return result;
};

export const getInitials = (str: string, maxLength = 1) => (
  str.split(' ').reduce(
    (collector, word) => (
      collector.length < maxLength
       ? collector + word.charAt(0)
       : collector
    ),
    ''
  ).toUpperCase()
);
