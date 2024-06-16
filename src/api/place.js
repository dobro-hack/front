import API_BASE_URL from "./config";

export const fetchPlacesByRouteId = async (routeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/places/${routeId}`);
    if (!response.ok) {
      throw new Error(`An error occurred: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch places:", error);
    throw error;
  }
};

export const createPlace = async (place) => {
  try {
    const response = await fetch(`${API_BASE_URL}/places`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(place),
    });
    if (!response.ok) {
      throw new Error(`An error occurred: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to create place:", error);
    throw error;
  }
};
