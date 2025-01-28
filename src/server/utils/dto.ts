export const toDTO = <T>(keys: string[], obj: T): Partial<T> => {
  return keys.reduce<Partial<T>>((result, key) => {
    if (key in (obj as object)) {
      result[key as keyof T] = obj[key as keyof T];
    }
    return result;
  }, {});
};
