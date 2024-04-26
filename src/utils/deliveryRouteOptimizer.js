const MappingService = require("../services/mappingService");

const calculateDistance = async (origin, destination) => {
  const distance = await MappingService.calculateDistance(origin, destination);
  return distance;
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
    const origin = route[i];
    const destination = route[i + 1];
    const distance = await calculateDistance(origin, destination);
    totalDistance += distance;
  }
  return totalDistance;
};

const findOptimalRoute = async (coordinates) => {
  const permutations = permuteCoordinates(coordinates);
  let shortestDistance = Infinity;
  let optimalRoute = null;
  for (const permutation of permutations) {
    const totalDistance = await calculateTotalDistance(permutation);
    if (totalDistance < shortestDistance) {
      shortestDistance = totalDistance;
      optimalRoute = permutation;
    }
  }
  return optimalRoute;
};

const coordinates = [
  "10.79628438955497,106.70592293472612",
  "10.801891047584164,106.70660958023404",
  "10.84129618691939,106.80987226663068",
];

findOptimalRoute(coordinates)
  .then((optimalRoute) => {
    console.log("Optimal Route:", optimalRoute);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
