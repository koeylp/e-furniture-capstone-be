const axios = require("axios");


const PROFILE = "mapbox/driving"

const getMapData = async (coordinates) => {
  try {
    const response = await axios.get(
      `${MAPBOX_API_BASE_URL}/v5/${PROFILE}/${coordinates}?access_token=${MAPBOX_ACCESS_TOKEN}`
    );
    return response;
  } catch (error) {
    console.error("Error making Mapbox API request:", error.message);
  }
};

module.exports = { getMapData };
