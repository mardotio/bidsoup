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

/**
 * Calls a function on each item in a nested object structure. Results are flattened
 *
 * @param arr Array of objects with nested shape
 * @param key location of array of nested objects
 * @param func Function to be called on each object
 */
export const flatmap = <K extends keyof T, T extends Nested<T, K>, R>(arr: T[], key: K, func: (i: T) => R): R[] => (
  arr.reduce(
    (acc, t) => (
      isEmpty(t[key])
        ? [...acc, func(t)]
        : [...acc, func(t), ...flatmap(t[key], key, func)]
    ),
    []
  )
);
