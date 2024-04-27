const axios = require("axios");

const PROFILE = ["search", "route"];

const VIETMAP_API_BASE_URL = "https://maps.vietmap.vn/api";
const VIET_MAP_API_KEY = "c043236fde99317c90dd9599c78938470a730f3e14962b4b";

class MappingService {
  static async convertToCoordinate(address) {
    const focused_latitude = 10.810753781567193;
    const focused_longitude = 106.66189033686534;
    const boundary_radius = 0.5;
    try {
      const response = await axios.get(
        `${VIETMAP_API_BASE_URL}/${PROFILE[0]}?api-version=1.1&apikey=${VIET_MAP_API_KEY}&focus.point.lat=${focused_latitude}&focus.point.lon=${focused_longitude}&boundary.circle.lon=${boundary_radius}&boundary.circle.lat=${boundary_radius}&boundary.circle.radius=${boundary_radius}&text=${address}`
      );
      return response.data;
    } catch (error) {
      console.error("Error making Vietmap API request:", error.message);
    }
  }

  static async calculateDistance(origin, destination) {
    try {
      const response = await axios.get(
        `${VIETMAP_API_BASE_URL}/${PROFILE[1]}?api-version=1.1&apikey=${VIET_MAP_API_KEY}&point=${origin}&point=${destination}&vehicle=car`
      );
      return response.data.paths[0].distance;
    } catch (error) {
      console.error("Error making Vietmap API request:", error.message);
    }
  }
}

async function functionName() {
  const temp = await MappingService.convertToCoordinate("24 Nguyễn Thị Diệu, Phường 6, Quận 3");
  console.log(temp);
}

functionName();

module.exports = MappingService;
