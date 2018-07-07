export const array2HashByKey = <T extends Record<K, string>, K extends keyof T>(arr: T[], key: K) => (
  arr.reduce(
    (hash, el) => (
      el[key] in hash
        ? Object.assign(hash, {[el[key]]: [el, ...hash[el[key]]]})
        : Object.assign(hash, {[el[key]]: el})
    ),
    {} as {[k in T[K]]: T[]}
  ));
