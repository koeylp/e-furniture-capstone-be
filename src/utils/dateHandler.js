const parseDate = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day + 1).setUTCHours(0, 0, 0, 0);
};
module.exports = {
  parseDate,
};
