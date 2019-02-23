interface ValueWithLength {
  length: number;
}

export const isEmpty = <T extends ValueWithLength>(value: T) => (
  value.length === 0
);

export const includes = <T>(arr: T[], value: T) => (
  arr.indexOf(value) >= 0
);

export const isDefined = <T>(value: T): value is NonNullable<T> => (
  value !== undefined && value !== null
);

export const isUndefined = <T>(value: T | void): value is void => (
  value === undefined || value === null
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

export const getCookie = (key: string) => (
  document.cookie.split(';')
  .map(c => c.trim())
  .filter(c => c.substr(0, key.length + 1) === key + '=')
  .reduce((result, val) => ( result == null ? val.substr(key.length + 1) : result), null)
);

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

// Makes sure given number is within the specified bounds.
// If number is smaller than min, min is returned,
// if number is larger than max, max is returned,
// otherwise the given nuber is returned.
export const limitNumberToRange = (n: number, min: number, max: number) => (
  Math.max(Math.min(n, max), min)
);

export const handleHttpErrors = (response: Response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};

export const isNumber = (value: string) => ( /^\d+\.?\d*$/.test(value) );
