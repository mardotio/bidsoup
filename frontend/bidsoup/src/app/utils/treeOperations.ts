import { isUndefined, Nested } from '@utils/utils';

/**
 * Add an element to tree at the specified location
 *
 * @param children Name of key containing the children elements
 * @param key Name of key the uniquely identifies a node on the tree (i.e. url)
 * @param arr Array containing the entire tree structure
 * @param match ID of element that is to be deleted
 */
export const deleteTreeElement =
  <P extends keyof T, T extends Nested<T, P>, K extends keyof T>
  (children: P, key: K, arr: T[], match: T[K]) => {
  let deleted = false;
  // Uses the children, key, and match parameters. The array is the only one
  // that changes each iteration.
  const recursiveDelete = (a: T[]): T[] => {
    return a.reduce(
      (final, e) => {
        if (e[key] === match) {
          deleted = true;
          return final;
        } else if (!deleted) {
          return [
            ...final,
            {
              ...e,
              [children]: recursiveDelete(e[children])
            }
          ];
        }
        return [...final, e];
      },
      []
    );
  };
  return recursiveDelete(arr);
};

/**
 * Add an element to tree at the specified location
 *
 * @param children Name of key containing the children elements
 * @param key Name of key the uniquely identifies a node on the tree (i.e. url)
 * @param parent Name of key that conatins the link to the parent node
 * @param arr Array containing the entire tree structure
 * @param element Element that should be added to the tree
 */
export const addTreeElement =
  <P extends keyof T, T extends Nested<T, P>, K extends keyof T>
  (children: P, key: K, parent: K, arr: T[], element: T) => {
  let wasAdded = false;
  // Uses the children, key, parent, and elements parameters. Leaves a single
  // argument for the array that should be searched.
  const recursiveAdd = (a: T[]): T[] => {
    return a.reduce(
      (final, e) => {
        if (e[key] === element[parent]) {
          wasAdded = true;
          return [
            ...final,
            {
              ...e,
              [children]: [...e[children], element]
            }
          ];
        } else if (!wasAdded) {
          return [
            ...final,
            {
              ...e,
              [children]: recursiveAdd(e[children])
            }
          ];
        }
        return [...final, e];
      },
      []
    );
  };
  const cleanTree = deleteTreeElement(children, key, arr, element[key]);
  return isUndefined(element[parent]) ? [...cleanTree, element] : recursiveAdd(cleanTree);
};
