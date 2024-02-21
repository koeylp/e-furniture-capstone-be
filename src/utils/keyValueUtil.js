const getKeyByValue = (map, value) => {
  for (const [key, val] of map.entries()) {
    if (val === value) {
      return key;
    }
  }
  return null;
};

module.exports = { getKeyByValue };
