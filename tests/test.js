// const arrays = [
//   [
//     {
//       variation_id: "660ccc670449387c6bd9972e",
//       property_id: "660ccc670449387c6bd9972f1",
//     },
//     {
//       variation_id: "660ccc670449387c6bd9972e",
//       property_id: "660ccc670449387c6bd9972f2",
//     },
//     {
//       variation_id: "660ccc670449387c6bd9972e",
//       property_id: "660ccc670449387c6bd9972f3",
//     },
//   ],
//   [
//     {
//       variation_id: "660ccc670449387c6bd99721",
//       property_id: "660ccc670449387c6bd9972f4",
//     },
//     {
//       variation_id: "660ccc670449387c6bd99721",
//       property_id: "660ccc670449387c6bd9972f5",
//     },
//     {
//       variation_id: "660ccc670449387c6bd99721",
//       property_id: "660ccc670449387c6bd9972f6",
//     },
//   ],
// ];
// const result = [];

// const StoreSubTypeService = require("../src/services/storeSubTypeService");

// function generateCombinations(currentCombination, remainingArrays) {
//   if (remainingArrays.length === 0) {
//     result.push(currentCombination);
//     return;
//   }

//   for (let i = 0; i < remainingArrays[0].length; i++) {
//     const newCombination = [...currentCombination, remainingArrays[0][i]];
//     generateCombinations(newCombination, remainingArrays.slice(1));
//   }
// }

// const data = (arrays) => {
//   const result = [];

//   function generateCombinations(currentCombination, remainingArrays) {
//     if (remainingArrays.length === 0) {
//       result.push(currentCombination);
//       return;
//     }

//     for (let i = 0; i < remainingArrays[0].length; i++) {
//       const newCombination = [...currentCombination, remainingArrays[0][i]];
//       generateCombinations(newCombination, remainingArrays.slice(1));
//     }
//   }

//   generateCombinations([], arrays);

//   return result;
// };

// console.log(data(arrays));
// const result = async () => {
//   return await StoreSubTypeService.restore("trongtoan");
// };
// let data = result();
// console.log(data);

// const data = (note) => {
//   let first = note.split(",");
//   let firstSplit = first[0].split("Code: ");
//   let secondSplit = first[1].split("Reason: ");
//   return { code: firstSplit[1], reason: secondSplit[1] };
// };
// let note = data(
//   "Refund Order Code: EFURNITURE-526E81C5, Reason: tui k mún mua nữa"
// );
// console.log(note);

// const data = [
//   {
//     product_id: "661cb193840860359f2a282d",
//     variation: [
//       {
//         variation_id: "661cb193840860359f2a282e",
//         property_id: "661cb193840860359f2a282f",
//       },
//     ],
//     quantity: 1,
//   },
// ];
const data = [
  {
    product_id: "6619f1abc9ffe02c99ce7a3c",
    variation: [
      {
        variation_id: "6619f1abc9ffe02c99ce7a3d",
        property_id: "6619f1abc9ffe02c99ce7a3e",
      },
    ],
    quantity: 1,
  },
];
const jsonStr = JSON.stringify(data);
console.log(jsonStr);
const parsedData = JSON.parse(jsonStr);
console.log(parsedData);
