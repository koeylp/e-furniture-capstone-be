class VariationUtils {
  static checkDuplicateProperties(variations) {
    const seenValues = new Set();
    let hasDuplicates = false;

    for (const variation of variations) {
      for (const property of variation.properties) {
        const value = property.value;

        if (seenValues.has(value)) {
          hasDuplicates = true;
          break;
        } else {
          seenValues.add(value);
        }
      }

      if (hasDuplicates) {
        break;
      }
    }

    return hasDuplicates;
  }
}
module.exports = VariationUtils;
