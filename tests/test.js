const arrays = [
  [
    {
      variation_id: "660ccc670449387c6bd9972e",
      property_id: "660ccc670449387c6bd9972f1",
    },
    {
      variation_id: "660ccc670449387c6bd9972e",
      property_id: "660ccc670449387c6bd9972f2",
    },
    {
      variation_id: "660ccc670449387c6bd9972e",
      property_id: "660ccc670449387c6bd9972f3",
    },
  ],
  [
    {
      variation_id: "660ccc670449387c6bd99721",
      property_id: "660ccc670449387c6bd9972f4",
    },
    {
      variation_id: "660ccc670449387c6bd99721",
      property_id: "660ccc670449387c6bd9972f5",
    },
    {
      variation_id: "660ccc670449387c6bd99721",
      property_id: "660ccc670449387c6bd9972f6",
    },
  ],
];
const result = [];

function generateCombinations(currentCombination, remainingArrays) {
  if (remainingArrays.length === 0) {
    result.push(currentCombination);
    return;
  }

  for (let i = 0; i < remainingArrays[0].length; i++) {
    const newCombination = [...currentCombination, remainingArrays[0][i]];
    generateCombinations(newCombination, remainingArrays.slice(1));
  }
}

const data = (arrays) => {
  const result = [];

  function generateCombinations(currentCombination, remainingArrays) {
    if (remainingArrays.length === 0) {
      result.push(currentCombination);
      return;
    }

    for (let i = 0; i < remainingArrays[0].length; i++) {
      const newCombination = [...currentCombination, remainingArrays[0][i]];
      generateCombinations(newCombination, remainingArrays.slice(1));
    }
  }

  generateCombinations([], arrays);

  return result;
};

console.log(data(arrays));
