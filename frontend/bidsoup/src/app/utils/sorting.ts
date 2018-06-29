// tslint:disable-next-line:no-any
export const array2HashByKey = (arr: any[], key: any) => {
  return arr.reduce(
    (ordered, el) => ({
      ...ordered,
      [el[key]]: ordered[el[key]]
        ? [...ordered[el[key]], el]
        : [el]
    }),
    {}
  );
};
