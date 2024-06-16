// api/coefficients.js
import API_BASE_URL from "./config";

export const updateCoefficients = async (
  routeId,
  coefficients,
  startDate,
  endDate,
  applyToAllRoutes
) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/routes-sql/update-coefficients`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          routeId,
          coefficients,
          startDate,
          endDate,
          applyToAllRoutes,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`An error occurred: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to update coefficients:", error);
    throw error;
  }
};
