const MappingService = require("../services/mappingService");
const OrderService = require("../services/orderSerivce");

const warehouseCoordinates = [106.80986153779497, 10.84132779895856];

const calculateDistance = async (origin, destination) => {
  let textOrigin = `${origin[1]},${origin[0]}`;
  let textDestination = `${destination[1]},${destination[0]}`;
  const distance = await MappingService.calculateDistance(
    textOrigin,
    textDestination
  );
  return distance;
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

const findOptimalRoute = async (orders) => {
  await convertAllLocationsToCoordinates(orders);

  const memo = {};

  const dp = async (i, mask) => {
    if (mask === (1 << orders.length) - 1) {
      return await calculateDistance(
        warehouseCoordinates,
        orders[i].coordinates
      );
    }
    if (memo[i] && memo[i][mask] !== undefined) {
      return memo[i][mask];
    }
    let minDistance = Infinity;
    for (let j = 0; j < orders.length; j++) {
      if (!(mask & (1 << j))) {
        const distanceToNextNode = await calculateDistance(
          orders[i].coordinates,
          orders[j].coordinates
        );
        const remainingDistance = await dp(j, mask | (1 << j));
        minDistance = Math.min(
          minDistance,
          distanceToNextNode + remainingDistance
        );
      }
    }
    if (!memo[i]) {
      memo[i] = {};
    }
    memo[i][mask] = minDistance;
    return minDistance;
  };

  let shortestDistance = Infinity;
  let optimalPermutation = null;
  for (let i = 0; i < orders.length; i++) {
    const distanceFromWarehouse = await dp(i, 1 << i);
    if (distanceFromWarehouse < shortestDistance) {
      shortestDistance = distanceFromWarehouse;
      optimalPermutation = i;
    }
  }
  return optimalPermutation;
};

module.exports = { findOptimalRoute };
