type ObjOfObjs<T> = {
  [key in string]: Array<T>
};

type HasString<K extends string> = {
  [key in K]: string
};

export const array2HashByKey = <T extends HasString<K>, K extends keyof T & string>(arr: T[], key: K) => {
  return arr.reduce<ObjOfObjs<T>>(
    (ordered, el) => {
      if (el[key] in ordered) {
        ordered[el[key]].push(el);
      } else {
        ordered[el[key]] = [el];
      }
    return ordered;
    },
    {}
  );
};
