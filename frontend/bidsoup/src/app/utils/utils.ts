// tslint:disable-next-line:no-any
export const isEmpty = (value: string | any[]) => (
  value.length === 0
);

type Nested<T, P extends keyof T> = {
  [key in P]: T[]
};

export const nestedFind = 
    <P extends keyof T, T extends Nested<T, P>, K extends keyof T>
    (arr: T[], key: K, match: T[K], nestedKey: P) => {
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
