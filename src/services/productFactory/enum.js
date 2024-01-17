const cornorSofa = {
  height: "number",
  width: "number",
  depth: "number",
  seatingHeight: "number",
  armrestHeight: "number",
  legsHeight: "number",
  weight: "number",
  seats: "number",
};
const ChaiseLongueSofa = {
  height: "number",
  width: "number",
  depth: "number",
  seatingHeight: "number",
  armrestHeight: "number",
  legsHeight: "number",
  weight: "number",
  seats: "number",
};
const BedSofa = {
  height: "number",
  width: "number",
  depth: "number",
  seatingHeight: "number",
  legsHeight: "number",
  weight: "number",
  maximumWeightLoad: "number",
};

const SofaSubType = {
  Cornor: "Cornor Sofa",
  ChaiseLongue: "Chaise Longue sofas",
  Modular: "Modular sofas",
  OpenEnd: "Sofas with open end",
};
const SofaSubTypeMap = new Map([
  ["Cornor", { key: "Cornor Sofa", subTypeEnum: cornorSofa }],
  [
    "ChaiseLongue",
    { key: "Chaise Longue sofas", subTypeEnum: ChaiseLongueSofa },
  ],
  ["Bed", { key: "Bed sofas", subTypeEnum: BedSofa }],
  ["OpenEnd", { key: "Sofas with open end", subTypeEnum: cornorSofa }],
]);
const returnSofaSubTypeMap = (code) => {
  return SofaSubTypeMap.get(code) || SofaSubTypeMap.get("default");
};

module.exports = {
  returnSofaSubTypeMap,
};
