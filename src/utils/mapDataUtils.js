const axios = require("axios");

const PROFILE = "mapbox/driving";
const MAPBOX_API_BASE_URL = "https://api.mapbox.com/directions";
const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

const getMapData = async (coordinates) => {
  try {
    const response = await axios.get(
      `${MAPBOX_API_BASE_URL}/v5/${PROFILE}/${coordinates}?access_token=${MAPBOX_TOKEN}`
    );
    return response.data;
  } catch (error) {
    console.error("Error making Mapbox API request:", error.message);
  }
};

module.exports = { getMapData };
