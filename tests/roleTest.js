const sortPhase = new Map([
  [1, "[101]"],
  [2, "[102]"],
  [3, "[103]"],
  [4, "[104]"],
  [5, "[105]"],
  [6, "[106]"],
  [7, "[107]"],
  [8, "[108]"],
  [9, "[109]"],
  [10, "[110]"],
  [11, "[111]"],
  [12, "[112]"],
  [13, "[113]"],
  [14, "[114]"],
  [15, "[115]"],
  [16, "[116]"],
  [17, "[117]"],
  [18, "[118]"],
  [19, "[119]"],
  [20, "[120]"],
]);
const returnSortPhase = (code) => {
  return sortPhase.get(code);
};
function splitStringAndPushToArray(inputString) {
  return inputString.split("");
}

const permissionArray = (decimalNumber) => {
  const inputString = decimalNumber.toString(2);
  const resultArray = splitStringAndPushToArray(inputString).reverse();
  let permissionArray = [];
  for (let i = 1; i < resultArray.length + 1; i++) {
    if (resultArray[i] === "1") {
      permissionArray.push(returnSortPhase(i));
    }
  }
  return permissionArray;
};
module.exports = {
  permissionArray,
  sortPhase,
};
