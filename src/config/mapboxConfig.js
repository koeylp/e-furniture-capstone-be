const axios = require("axios");

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoidGhla2hvaTE5MTkiLCJhIjoiY2x0Z2s1YzUxMHlhcTJtbTJuZG91Z3N5cCJ9.mdYXEo8IfpGfVjZpQmBCNA";
const MAPBOX_API_BASE_URL = "https://api.mapbox.com/directions";
const profile = "mapbox/driving";
const coordinates =
  "106.69007008465445,10.776469482338996;106.6867565740169,10.779488160472553";

const getMapData = async () => {
  try {
    const response = await axios.get(
      `${MAPBOX_API_BASE_URL}/v5/${profile}/${coordinates}?access_token=${MAPBOX_ACCESS_TOKEN}`
    );

    // Process the response data
    console.log(response.data);
  } catch (error) {
    console.error("Error making Mapbox API request:", error.message);
  }
};

// Call the function to get Mapbox data
getMapData();
