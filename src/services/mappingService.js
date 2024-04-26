const axios = require("axios");

const PROFILE = ["place", "route"];

const VIETMAP_API_BASE_URL = "https://maps.vietmap.vn/api";
const VIETMAP_TOKEN = "c043236fde99317c90dd9599c78938470a730f3e14962b4b";

class MappingService {
  static async convertToCoordinate(ref_id) {
    try {
      const response = await axios.get(
        `${VIETMAP_API_BASE_URL}/${PROFILE[0]}/v3?apikey=${VIETMAP_TOKEN}&refid=${ref_id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error making Vietmap API request:", error.message);
    }
  }

  static async calculateDistance(origin, destination) {
    try {
      const response = await axios.get(
        `${VIETMAP_API_BASE_URL}/${PROFILE[1]}?api-version=1.1&apikey=${VIETMAP_TOKEN}&point=${origin}&point=${destination}&vehicle=car`
      );
      return response.data.paths[0].distance;
    } catch (error) {
      console.error("Error making Vietmap API request:", error.message);
    }
  }
}

module.exports = MappingService;
