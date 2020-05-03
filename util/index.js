export const maxBy = (arr, fn) => {
  return arr.reduce((a, b) => (fn(a) > fn(b) ? a : b), arr[0]);
};

export const toLookup = (arr, by) =>
  arr.reduce((acc, val) => {
    acc[by(val)] = true;
    return acc;
  }, {});

export const setValuesTo = (obj, value) => {
  const newObj = { ...obj };
  for (const key of Object.keys(newObj)) {
    newObj[key] = value;
  }
  return newObj;
};
