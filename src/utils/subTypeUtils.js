const FilterSubType = (subTypes) => {
  let groupedItems = {};
  subTypes.forEach((item) => {
    const group = item.group.label;
    if (!groupedItems[group]) {
      groupedItems[group] = [];
    }
    groupedItems[group].push(item);
  });
  return groupedItems;
};
module.exports = {
  FilterSubType,
};
