type HasString<K extends string> = {
  [key in K]: string
};

export const array2HashByKey = <T extends HasString<K>, K extends keyof T & string>(arr: T[], key: K) => (
  arr.reduce(
    (hash, el) => (
      el[key] in hash
        ? Object.assign(hash, {[el[key]]: [el, ...hash[el[key]]]})
        : Object.assign(hash, {[el[key]]: el})
    ),
    {} as {[k in string]: T[]}
  ));
