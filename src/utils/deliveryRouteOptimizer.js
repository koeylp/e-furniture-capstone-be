const MappingService = require("../services/mappingService");
const OrderService = require("../services/orderSerivce");

const warehouseCoordinates = [106.80986153779497, 10.84132779895856];
const distanceCache = new Map();

const calculateDistance = async (origin, destination) => {
  const key = `${origin}_${destination}`;
  if (distanceCache.has(key)) {
    return distanceCache.get(key);
  } else {
    let textOrigin = `${origin[1]},${origin[0]}`;
    let textDestination = `${destination[1]},${destination[0]}`;
    const distance = await MappingService.calculateDistance(
      textOrigin,
      textDestination
    );
    distanceCache.set(key, distance);
    return distance;
  }
};

const permuteCoordinates = (coordinates) => {
  if (coordinates.length === 1) return [coordinates];
  const permutations = [];
  for (let i = 0; i < coordinates.length; i++) {
    const currentCoordinate = coordinates[i];
    const remainingCoordinates = [
      ...coordinates.slice(0, i),
      ...coordinates.slice(i + 1),
    ];
    const permutationsOfRest = permuteCoordinates(remainingCoordinates);
    permutationsOfRest.forEach((permutation) => {
      permutations.push([currentCoordinate, ...permutation]);
    });
  }
  return permutations;
};

const calculateTotalDistance = async (route) => {
  let totalDistance = 0;
  for (let i = 0; i < route.length - 1; i++) {
    const origin = route[i].coordinates;
    const destination = route[i + 1].coordinates;
    const distance = await calculateDistance(origin, destination);
    totalDistance += distance;
  }
  return totalDistance;
};

const convertAllLocationsToCoordinates = async (orders) => {
  for (let i = 0; i < orders.length; i++) {
    let address = await OrderService.getAddressByOrderId(orders[i].order);
    orders[i].coordinates = await MappingService.fetchCoordinateFromAddress(
      address
    );
  }
  return orders;
};

const findOptimalRoute = async (orders) => {
  await convertAllLocationsToCoordinates(orders);
  const permutations = permuteCoordinates(orders);
  let shortestDistance = Infinity;
  let optimalPermutation = null;
  for (const permutation of permutations) {
    const totalDistance = await calculateTotalDistance([
      { coordinates: warehouseCoordinates },
      ...permutation,
      { coordinates: warehouseCoordinates },
    ]);
    if (totalDistance < shortestDistance) {
      shortestDistance = totalDistance;
      optimalPermutation = permutation;
    }
  }
  return optimalPermutation;
};

module.exports = { findOptimalRoute };
