export const decreaseTwitterIdByOne = (id: string) => {
  let result = id;
  let i = id.length - 1;
  while (i > -1) {
    if (id[i] === '0') {
      result = result.substring(0, i) + '9' + result.substring(i + 1);
      i--;
    } else {
      result =
        result.substring(0, i) +
        (parseInt(id[i], 10) - 1).toString() +
        result.substring(i + 1);
      return result;
    }
  }
  return result;
};
